package com.rims.supplier;

import com.rims.common.exception.DuplicateResourceException;
import com.rims.common.exception.ResourceNotFoundException;
import com.rims.common.response.PagedResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository supplierRepository;

    @Transactional(readOnly = true)
    public PagedResponse<SupplierDto> getAllSuppliers(Boolean activeOnly, Pageable pageable) {
        Page<Supplier> page;
        if (activeOnly != null && activeOnly) {
            page = supplierRepository.findByIsActive(true, pageable);
        } else {
            page = supplierRepository.findAll(pageable);
        }
        return PagedResponse.from(page.map(SupplierDto::from));
    }

    @Transactional(readOnly = true)
    public List<SupplierDto> getActiveSuppliersList() {
        return supplierRepository.findAll().stream()
                .filter(s -> Boolean.TRUE.equals(s.getIsActive()))
                .map(SupplierDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public SupplierDto getSupplierById(Long id) {
        Supplier s = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier", "id", id));
        return SupplierDto.from(s);
    }

    @Transactional
    public SupplierDto createSupplier(SupplierDto dto) {
        if (supplierRepository.existsByCode(dto.getCode())) {
            throw new DuplicateResourceException("Supplier with code already exists: " + dto.getCode());
        }

        Supplier s = Supplier.builder()
                .code(dto.getCode())
                .name(dto.getName())
                .contactPerson(dto.getContactPerson())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .address(dto.getAddress())
                .gstin(dto.getGstin())
                .paymentTerms(dto.getPaymentTerms())
                .rating(dto.getRating() != null ? dto.getRating() : new java.math.BigDecimal("4.50"))
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .build();

        return SupplierDto.from(supplierRepository.save(s));
    }

    @Transactional
    public SupplierDto updateSupplier(Long id, SupplierDto dto) {
        Supplier s = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier", "id", id));

        s.setName(dto.getName());
        s.setContactPerson(dto.getContactPerson());
        s.setEmail(dto.getEmail());
        s.setPhone(dto.getPhone());
        s.setAddress(dto.getAddress());
        s.setGstin(dto.getGstin());
        s.setPaymentTerms(dto.getPaymentTerms());
        if (dto.getRating() != null) s.setRating(dto.getRating());
        if (dto.getIsActive() != null) s.setIsActive(dto.getIsActive());

        return SupplierDto.from(supplierRepository.save(s));
    }

    @Transactional
    public void toggleActiveStatus(Long id) {
        Supplier s = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier", "id", id));
        s.setIsActive(!Boolean.TRUE.equals(s.getIsActive()));
        supplierRepository.save(s);
    }
}

