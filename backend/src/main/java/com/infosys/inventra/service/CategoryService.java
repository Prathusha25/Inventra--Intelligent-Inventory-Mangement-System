package com.infosys.inventra.service;

import com.infosys.inventra.dto.CategoryDTO;
import com.infosys.inventra.model.Category;
import com.infosys.inventra.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    /**
     * Get all categories
     */
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get active categories only
     */
    public List<CategoryDTO> getActiveCategories() {
        return categoryRepository.findByActive(true).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get category by ID
     */
    public Optional<CategoryDTO> getCategoryById(Long id) {
        return categoryRepository.findById(id).map(this::convertToDTO);
    }

    /**
     * Get category by name
     */
    public Optional<CategoryDTO> getCategoryByName(String name) {
        return categoryRepository.findByName(name).map(this::convertToDTO);
    }

    /**
     * Get subcategories
     */
    public List<CategoryDTO> getSubcategories(Long parentId) {
        return categoryRepository.findByParentCategoryId(parentId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Create new category
     */
    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        if (categoryRepository.existsByName(categoryDTO.getName())) {
            throw new RuntimeException("Category with this name already exists");
        }

        Category category = convertToEntity(categoryDTO);
        category = categoryRepository.save(category);
        return convertToDTO(category);
    }

    /**
     * Update category
     */
    public Optional<CategoryDTO> updateCategory(Long id, CategoryDTO categoryDTO) {
        Optional<Category> categoryOpt = categoryRepository.findById(id);

        if (categoryOpt.isEmpty()) {
            return Optional.empty();
        }

        Category category = categoryOpt.get();

        // Check if name is being changed and if it's already taken
        if (!category.getName().equals(categoryDTO.getName())) {
            if (categoryRepository.existsByName(categoryDTO.getName())) {
                throw new RuntimeException("Category with this name already exists");
            }
        }

        updateCategoryFromDTO(category, categoryDTO);
        category = categoryRepository.save(category);
        return Optional.of(convertToDTO(category));
    }

    /**
     * Delete category
     */
    public boolean deleteCategory(Long id) {
        if (categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Convert Category entity to DTO
     */
    private CategoryDTO convertToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        dto.setParentCategoryId(category.getParentCategoryId());
        dto.setActive(category.getActive());
        dto.setReorderLevel(category.getReorderLevel());
        return dto;
    }

    /**
     * Convert DTO to Category entity
     */
    private Category convertToEntity(CategoryDTO dto) {
        Category category = new Category();
        updateCategoryFromDTO(category, dto);
        return category;
    }

    /**
     * Update Category entity from DTO
     */
    private void updateCategoryFromDTO(Category category, CategoryDTO dto) {
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        category.setParentCategoryId(dto.getParentCategoryId());
        if (dto.getActive() != null) {
            category.setActive(dto.getActive());
        }
        category.setReorderLevel(dto.getReorderLevel());
    }
}
