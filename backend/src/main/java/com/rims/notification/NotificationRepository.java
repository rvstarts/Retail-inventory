package com.rims.notification;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientUserIdOrderByCreatedAtDesc(Long userId);
    Page<Notification> findByRecipientUserId(Long userId, Pageable pageable);
    long countByRecipientUserIdAndIsReadFalse(Long userId);
    List<Notification> findTop10ByOrderByCreatedAtDesc();
}

