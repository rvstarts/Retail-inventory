package com.rims.store;

import com.rims.common.exception.DuplicateResourceException;
import com.rims.common.exception.ResourceNotFoundException;
import com.rims.warehouse.Warehouse;
import com.rims.warehouse.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StoreService {

    private final StoreRepository storeRepository;
    private final WarehouseRepository warehouseRepository;

    @Transactional(readOnly = true)
    public List<StoreDto> getAllStores() {
        return storeRepository.findAll().stream().map(StoreDto::from).toList();
    }

    @Transactional(readOnly = true)
    public StoreDto getStoreById(Long id) {
        Store s = storeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Store", "id", id));
        return StoreDto.from(s);
    }

    @Transactional
    public StoreDto createStore(StoreDto dto) {
        if (storeRepository.existsByCode(dto.getCode())) {
            throw new DuplicateResourceException("Store with code already exists: " + dto.getCode());
        }

        Warehouse assignedWh = null;
        if (dto.getAssignedWarehouseId() != null) {
            assignedWh = warehouseRepository.findById(dto.getAssignedWarehouseId()).orElse(null);
        }

        Store s = Store.builder()
                .code(dto.getCode())
                .name(dto.getName())
                .addressLine(dto.getAddressLine())
                .city(dto.getCity())
                .state(dto.getState())
                .postalCode(dto.getPostalCode())
                .contactPhone(dto.getContactPhone())
                .contactEmail(dto.getContactEmail())
                .assignedWarehouse(assignedWh)
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .build();

        return StoreDto.from(storeRepository.save(s));
    }

    @Transactional
    public StoreDto updateStore(Long id, StoreDto dto) {
        Store s = storeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Store", "id", id));

        s.setName(dto.getName());
        s.setAddressLine(dto.getAddressLine());
        s.setCity(dto.getCity());
        s.setState(dto.getState());
        s.setPostalCode(dto.getPostalCode());
        s.setContactPhone(dto.getContactPhone());
        s.setContactEmail(dto.getContactEmail());

        if (dto.getAssignedWarehouseId() != null) {
            Warehouse assignedWh = warehouseRepository.findById(dto.getAssignedWarehouseId()).orElse(null);
            s.setAssignedWarehouse(assignedWh);
        }

        if (dto.getIsActive() != null) s.setIsActive(dto.getIsActive());

        return StoreDto.from(storeRepository.save(s));
    }
}

