package com.rims.product;

import com.rims.category.Category;
import com.rims.category.CategoryRepository;
import com.rims.common.exception.DuplicateResourceException;
import com.rims.inventory.InventoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private InventoryRepository inventoryRepository;

    @InjectMocks
    private ProductService productService;

    private Category testCategory;
    private ProductRequestDto productRequest;

    @BeforeEach
    void setUp() {
        testCategory = Category.builder()
                .id(1L)
                .name("Men's Apparel")
                .code("CAT_MEN_APP")
                .build();

        productRequest = ProductRequestDto.builder()
                .name("Raymond Linen Shirt")
                .sku("MEN-SHIRT-001")
                .categoryId(1L)
                .brand("Raymond")
                .purchasePrice(new BigDecimal("1200.00"))
                .sellingPrice(new BigDecimal("2499.00"))
                .minStockLevel(10)
                .reorderPoint(20)
                .build();
    }

    @Test
    @DisplayName("Should create product successfully with valid details")
    void testCreateProductSuccess() {
        when(productRepository.existsBySku("MEN-SHIRT-001")).thenReturn(false);
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> {
            Product p = invocation.getArgument(0);
            p.setId(100L);
            return p;
        });

        ProductResponseDto result = productService.createProduct(productRequest);

        assertNotNull(result);
        assertEquals("MEN-SHIRT-001", result.getSku());
        assertEquals("Raymond Linen Shirt", result.getName());
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when registering existing SKU")
    void testDuplicateSkuThrowsException() {
        when(productRepository.existsBySku("MEN-SHIRT-001")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> productService.createProduct(productRequest));
        verify(productRepository, never()).save(any(Product.class));
    }
}

