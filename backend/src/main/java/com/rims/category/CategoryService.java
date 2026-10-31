package com.rims.category;

import com.rims.common.exception.DuplicateResourceException;
import com.rims.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream().map(CategoryDto::from).toList();
    }

    @Transactional(readOnly = true)
    public CategoryDto getCategoryById(Long id) {
        Category c = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        return CategoryDto.from(c);
    }

    @Transactional
    public CategoryDto createCategory(CategoryDto dto) {
        if (categoryRepository.existsByName(dto.getName())) {
            throw new DuplicateResourceException("Category name already exists: " + dto.getName());
        }
        if (categoryRepository.existsByCode(dto.getCode())) {
            throw new DuplicateResourceException("Category code already exists: " + dto.getCode());
        }

        Category c = Category.builder()
                .name(dto.getName())
                .code(dto.getCode())
                .description(dto.getDescription())
                .parentId(dto.getParentId())
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .build();

        return CategoryDto.from(categoryRepository.save(c));
    }

    @Transactional
    public CategoryDto updateCategory(Long id, CategoryDto dto) {
        Category c = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));

        if (!c.getName().equalsIgnoreCase(dto.getName()) && categoryRepository.existsByName(dto.getName())) {
            throw new DuplicateResourceException("Category name already exists: " + dto.getName());
        }

        c.setName(dto.getName());
        c.setCode(dto.getCode());
        c.setDescription(dto.getDescription());
        c.setParentId(dto.getParentId());
        if (dto.getIsActive() != null) c.setIsActive(dto.getIsActive());

        return CategoryDto.from(categoryRepository.save(c));
    }

    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category", "id", id);
        }
        categoryRepository.deleteById(id);
    }
}

