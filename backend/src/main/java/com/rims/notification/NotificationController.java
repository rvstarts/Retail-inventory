package com.rims.notification;

import com.rims.common.response.ApiResponse;
import com.rims.user.User;
import com.rims.user.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "Endpoints for user alerts, low-stock notifications, and PO delivery warnings")
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @GetMapping
    @Operation(summary = "Get notifications for current user or top system notifications")
    public ResponseEntity<ApiResponse<List<NotificationDto>>> getNotifications(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<Notification> list;
        if (userDetails != null) {
            User user = userRepository.findByUsername(userDetails.getUsername()).orElse(null);
            if (user != null) {
                list = notificationRepository.findByRecipientUserIdOrderByCreatedAtDesc(user.getId());
                if (list.isEmpty()) {
                    list = notificationRepository.findTop10ByOrderByCreatedAtDesc();
                }
            } else {
                list = notificationRepository.findTop10ByOrderByCreatedAtDesc();
            }
        } else {
            list = notificationRepository.findTop10ByOrderByCreatedAtDesc();
        }

        return ResponseEntity.ok(ApiResponse.success(list.stream().map(NotificationDto::from).toList()));
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Mark a notification as read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setIsRead(true);
            notificationRepository.save(n);
        });
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", null));
    }
}

