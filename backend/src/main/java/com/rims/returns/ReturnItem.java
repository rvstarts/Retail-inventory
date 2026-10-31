package com.rims.returns;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.rims.product.Product;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "return_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReturnItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "return_id", nullable = false)
    @JsonIgnore
    private ReturnOrder returnOrder;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String condition = "RESTOCKABLE"; // RESTOCKABLE, DAMAGED, DEFECTIVE

    @Column(name = "is_restocked", nullable = false)
    @Builder.Default
    private Boolean isRestocked = false;
}

