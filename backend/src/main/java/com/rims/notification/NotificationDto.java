package com.rims.notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {
    private Long id;
    private Long recipientUserId;
    private String title;
    private String message;
    private String type;
    private Boolean isRead;
    private String referenceLink;
    private Instant createdAt;

    public static NotificationDto from(Notification n) {
        return NotificationDto.builder()
                .id(n.getId())
                .recipientUserId(n.getRecipientUser() != null ? n.getRecipientUser().getId() : null)
                .title(n.getTitle())
                .message(n.getMessage())
                .type(n.getType())
                .isRead(n.getIsRead())
                .referenceLink(n.getReferenceLink())
                .createdAt(n.getCreatedAt())
                .build();
    }
}

