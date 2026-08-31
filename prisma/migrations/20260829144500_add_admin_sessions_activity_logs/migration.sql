-- CreateTable
CREATE TABLE `AdminSession` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(255) NOT NULL,
    `ipAddress` VARCHAR(45) NULL,
    `userAgent` VARCHAR(500) NULL,
    `deviceType` VARCHAR(50) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `isRevoked` BOOLEAN NOT NULL DEFAULT false,
    `revokedAt` DATETIME(3) NULL,
    `revokedReason` VARCHAR(255) NULL,
    `lastActiveAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endedAt` DATETIME(3) NULL,

    UNIQUE INDEX `AdminSession_sessionToken_key`(`sessionToken`),
    INDEX `AdminSession_userId_idx`(`userId`),
    INDEX `AdminSession_lastActiveAt_idx`(`lastActiveAt`),
    INDEX `AdminSession_active_status_idx`(`isActive`, `isRevoked`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ActivityLog` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `action` ENUM('LOGIN', 'LOGIN_FAILED', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE') NOT NULL,
    `entityType` VARCHAR(50) NOT NULL,
    `entityId` VARCHAR(100) NULL,
    `entityTitle` VARCHAR(255) NULL,
    `description` VARCHAR(500) NOT NULL,
    `metadata` JSON NULL,
    `ipAddress` VARCHAR(45) NULL,
    `userAgent` VARCHAR(500) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ActivityLog_userId_idx`(`userId`),
    INDEX `ActivityLog_action_idx`(`action`),
    INDEX `ActivityLog_entityType_idx`(`entityType`),
    INDEX `ActivityLog_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AdminSession` ADD CONSTRAINT `AdminSession_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActivityLog` ADD CONSTRAINT `ActivityLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
