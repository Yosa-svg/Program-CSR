-- 1. Konversi seluruh role pengguna lama menjadi ADMIN_CSR
UPDATE `User` SET `role` = 'ADMIN_CSR';

-- 2. Hapus Foreign Key constraint relasi User ke Sector
ALTER TABLE `User` DROP FOREIGN KEY `User_sectorId_fkey`;

-- 3. Hapus kolom sectorId dan ubah tipe kolom role menjadi ENUM('ADMIN_CSR')
ALTER TABLE `User` DROP COLUMN `sectorId`,
    MODIFY `role` ENUM('ADMIN_CSR') NOT NULL DEFAULT 'ADMIN_CSR';
