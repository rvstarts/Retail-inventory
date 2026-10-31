package com.rims.product;

import com.rims.category.Category;
import com.rims.category.CategoryRepository;
import com.rims.common.exception.BadRequestException;
import com.rims.common.exception.DuplicateResourceException;
import com.rims.common.exception.ResourceNotFoundException;
import com.rims.common.response.PagedResponse;
import com.rims.inventory.Inventory;
import com.rims.inventory.InventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.csv.CSVRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.*;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final InventoryRepository inventoryRepository;

    @Transactional(readOnly = true)
    public PagedResponse<ProductResponseDto> getProducts(
            String searchTerm,
            Long categoryId,
            String status,
            Pageable pageable
    ) {
        Page<Product> page = productRepository.searchProducts(
                searchTerm != null && !searchTerm.isBlank() ? searchTerm : null,
                categoryId,
                status != null && !status.isBlank() ? status : null,
                pageable
        );

        return PagedResponse.from(page.map(this::mapToResponseDto));
    }

    @Transactional(readOnly = true)
    public ProductResponseDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return mapToResponseDto(product);
    }

    @Transactional(readOnly = true)
    public ProductResponseDto getProductBySku(String sku) {
        Product product = productRepository.findBySku(sku)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "sku", sku));
        return mapToResponseDto(product);
    }

    @Transactional
    public ProductResponseDto createProduct(ProductRequestDto dto) {
        if (productRepository.existsBySku(dto.getSku())) {
            throw new DuplicateResourceException("Product with SKU already exists: " + dto.getSku());
        }

        String barcode = dto.getBarcode();
        if (barcode == null || barcode.isBlank()) {
            barcode = "890" + System.currentTimeMillis() % 10000000000L;
        } else if (productRepository.existsByBarcode(barcode)) {
            throw new DuplicateResourceException("Product with barcode already exists: " + barcode);
        }

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", dto.getCategoryId()));

        Product product = Product.builder()
                .name(dto.getName())
                .sku(dto.getSku())
                .barcode(barcode)
                .description(dto.getDescription())
                .category(category)
                .brand(dto.getBrand())
                .purchasePrice(dto.getPurchasePrice())
                .sellingPrice(dto.getSellingPrice())
                .minStockLevel(dto.getMinStockLevel() != null ? dto.getMinStockLevel() : 10)
                .reorderPoint(dto.getReorderPoint() != null ? dto.getReorderPoint() : 20)
                .imageUrl(dto.getImageUrl())
                .status(dto.getStatus() != null ? dto.getStatus() : "ACTIVE")
                .build();

        product = productRepository.save(product);
        return mapToResponseDto(product);
    }

    @Transactional
    public ProductResponseDto updateProduct(Long id, ProductRequestDto dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        if (!product.getSku().equalsIgnoreCase(dto.getSku()) && productRepository.existsBySku(dto.getSku())) {
            throw new DuplicateResourceException("Product with SKU already exists: " + dto.getSku());
        }

        if (dto.getBarcode() != null && !dto.getBarcode().equalsIgnoreCase(product.getBarcode())) {
            if (productRepository.existsByBarcode(dto.getBarcode())) {
                throw new DuplicateResourceException("Product with barcode already exists: " + dto.getBarcode());
            }
            product.setBarcode(dto.getBarcode());
        }

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", dto.getCategoryId()));

        product.setName(dto.getName());
        product.setSku(dto.getSku());
        product.setDescription(dto.getDescription());
        product.setCategory(category);
        product.setBrand(dto.getBrand());
        product.setPurchasePrice(dto.getPurchasePrice());
        product.setSellingPrice(dto.getSellingPrice());
        if (dto.getMinStockLevel() != null) product.setMinStockLevel(dto.getMinStockLevel());
        if (dto.getReorderPoint() != null) product.setReorderPoint(dto.getReorderPoint());
        if (dto.getImageUrl() != null) product.setImageUrl(dto.getImageUrl());
        if (dto.getStatus() != null) product.setStatus(dto.getStatus());

        product = productRepository.save(product);
        return mapToResponseDto(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        List<Inventory> inventories = inventoryRepository.findByProductId(id);
        int totalQuantity = inventories.stream().mapToInt(Inventory::getQuantity).sum();
        if (totalQuantity > 0) {
            throw new BadRequestException("Cannot delete product with existing inventory (" + totalQuantity + " units in stock). Deactivate it instead.");
        }

        product.setStatus("INACTIVE");
        productRepository.save(product);
    }

    @Transactional
    public Map<String, Object> importProductsCsv(InputStream inputStream) {
        int importedCount = 0;
        int skippedCount = 0;
        List<String> errors = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8));
             CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT
                     .builder()
                     .setHeader()
                     .setSkipHeaderRecord(true)
                     .setIgnoreHeaderCase(true)
                     .setTrim(true)
                     .build())) {

            for (CSVRecord record : csvParser) {
                try {
                    String sku = record.get("sku");
                    if (sku == null || sku.isBlank() || productRepository.existsBySku(sku)) {
                        skippedCount++;
                        continue;
                    }

                    String name = record.get("name");
                    String categoryName = record.get("category");
                    Category category = categoryRepository.findByName(categoryName)
                            .orElseGet(() -> categoryRepository.findAll().stream().findFirst()
                                    .orElseThrow(() -> new BadRequestException("No categories exist to assign imported products")));

                    BigDecimal purchasePrice = new BigDecimal(record.get("purchasePrice"));
                    BigDecimal sellingPrice = new BigDecimal(record.get("sellingPrice"));

                    Product product = Product.builder()
                            .name(name)
                            .sku(sku)
                            .barcode(record.isMapped("barcode") && !record.get("barcode").isBlank()
                                    ? record.get("barcode") : "890" + System.currentTimeMillis() % 10000000000L)
                            .description(record.isMapped("description") ? record.get("description") : "")
                            .category(category)
                            .brand(record.isMapped("brand") ? record.get("brand") : "Generic")
                            .purchasePrice(purchasePrice)
                            .sellingPrice(sellingPrice)
                            .minStockLevel(record.isMapped("minStockLevel") ? Integer.parseInt(record.get("minStockLevel")) : 10)
                            .reorderPoint(record.isMapped("reorderPoint") ? Integer.parseInt(record.get("reorderPoint")) : 20)
                            .imageUrl(record.isMapped("imageUrl") ? record.get("imageUrl") : "")
                            .status("ACTIVE")
                            .build();

                    productRepository.save(product);
                    importedCount++;
                } catch (Exception ex) {
                    skippedCount++;
                    errors.add("Row " + record.getRecordNumber() + ": " + ex.getMessage());
                }
            }
        } catch (IOException e) {
            throw new BadRequestException("Failed to read CSV input stream: " + e.getMessage());
        }

        Map<String, Object> result = new HashMap<>();
        result.put("importedCount", importedCount);
        result.put("skippedCount", skippedCount);
        result.put("errors", errors);
        return result;
    }

    @Transactional(readOnly = true)
    public byte[] exportProductsCsv() {
        List<Product> products = productRepository.findAll();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try (CSVPrinter printer = new CSVPrinter(new PrintWriter(new OutputStreamWriter(out, StandardCharsets.UTF_8)),
                CSVFormat.DEFAULT.builder().setHeader(
                        "id", "name", "sku", "barcode", "category", "brand",
                        "purchasePrice", "sellingPrice", "minStockLevel", "reorderPoint", "status"
                ).build())) {

            for (Product p : products) {
                printer.printRecord(
                        p.getId(),
                        p.getName(),
                        p.getSku(),
                        p.getBarcode(),
                        p.getCategory() != null ? p.getCategory().getName() : "",
                        p.getBrand(),
                        p.getPurchasePrice(),
                        p.getSellingPrice(),
                        p.getMinStockLevel(),
                        p.getReorderPoint(),
                        p.getStatus()
                );
            }
            printer.flush();
        } catch (IOException e) {
            throw new BadRequestException("Failed to generate CSV export: " + e.getMessage());
        }

        return out.toByteArray();
    }

    private ProductResponseDto mapToResponseDto(Product product) {
        List<Inventory> inventories = inventoryRepository.findByProductId(product.getId());
        int totalStock = inventories.stream().mapToInt(i -> i.getQuantity() != null ? i.getQuantity() : 0).sum();
        int totalReserved = inventories.stream().mapToInt(i -> i.getReservedQuantity() != null ? i.getReservedQuantity() : 0).sum();
        return ProductResponseDto.from(product, totalStock, totalReserved);
    }
}

