package com.rims.warehouse;

import com.rims.common.exception.DuplicateResourceException;
import com.rims.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WarehouseService {

    private final WarehouseRepository warehouseRepository;

    @Transactional(readOnly = true)
    public List<WarehouseDto> getAllWarehouses() {
        return warehouseRepository.findAll().stream().map(WarehouseDto::from).toList();
    }

    @Transactional(readOnly = true)
    public WarehouseDto getWarehouseById(Long id) {
        Warehouse w = warehouseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse", "id", id));
        return WarehouseDto.from(w);
    }

    @Transactional
    public WarehouseDto createWarehouse(WarehouseDto dto) {
        if (warehouseRepository.existsByCode(dto.getCode())) {
            throw new DuplicateResourceException("Warehouse with code already exists: " + dto.getCode());
        }

        Warehouse w = Warehouse.builder()
                .code(dto.getCode())
                .name(dto.getName())
                .addressLine(dto.getAddressLine())
                .city(dto.getCity())
                .state(dto.getState())
                .postalCode(dto.getPostalCode())
                .contactPhone(dto.getContactPhone())
                .contactEmail(dto.getContactEmail())
                .capacity(dto.getCapacity() != null ? dto.getCapacity() : 100000)
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .build();

        return WarehouseDto.from(warehouseRepository.save(w));
    }

    @Transactional
    public WarehouseDto updateWarehouse(Long id, WarehouseDto dto) {
        Warehouse w = warehouseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse", "id", id));

        w.setName(dto.getName());
        w.setAddressLine(dto.getAddressLine());
        w.setCity(dto.getCity());
        w.setState(dto.getState());
        w.setPostalCode(dto.getPostalCode());
        w.setContactPhone(dto.getContactPhone());
        w.setContactEmail(dto.getContactEmail());
        if (dto.getCapacity() != null) w.setCapacity(dto.getCapacity());
        if (dto.getIsActive() != null) w.setIsActive(dto.getIsActive());

        return WarehouseDto.from(warehouseRepository.save(w));
    }
}

