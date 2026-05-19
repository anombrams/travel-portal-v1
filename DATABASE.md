# Database Schema - seapark.id

Platform konservasi laut Indonesia menggunakan PostgreSQL sebagai database utama dengan Drizzle ORM.

## Tabel Database

### 1. users
Menyimpan data pengguna dan profil Sea-Passport.

| Column | Type | Description |
|--------|------|-------------|
| id | varchar (UUID) | Primary key |
| email | varchar | Email unik pengguna |
| password | varchar | Password ter-hash (bcrypt) |
| firstName | varchar | Nama depan |
| lastName | varchar | Nama belakang |
| profileImageUrl | varchar | URL foto profil |
| level | integer | Level gamifikasi (1-10) |
| levelTitle | text | Judul level (Ocean Explorer, dll) |
| totalDonation | integer | Total donasi dalam Rupiah |
| coralsAdopted | integer | Jumlah karang yang diadopsi |
| locationsVisited | integer | Jumlah lokasi dikunjungi |
| xp | integer | Experience points |
| resetToken | varchar | Token reset password |
| resetTokenExpiry | timestamp | Waktu expired token |
| createdAt | timestamp | Tanggal pembuatan akun |
| updatedAt | timestamp | Tanggal update terakhir |

### 2. locations
20 kawasan konservasi laut Indonesia.

| Column | Type | Description |
|--------|------|-------------|
| id | varchar | Primary key (slug) |
| name | text | Nama lengkap lokasi |
| shortName | text | Nama singkat |
| region | text | Provinsi/wilayah |
| description | text | Deskripsi lokasi |
| uniqueFeature | text | Fitur unik lokasi |
| image | text | Path gambar |
| availableSlots | integer | Slot tersedia per hari |
| ticketPrice | integer | Harga tiket (Rupiah) |
| features | text[] | Array fitur aktivitas |

### 3. tickets
Tiket masuk kawasan konservasi.

| Column | Type | Description |
|--------|------|-------------|
| id | varchar (UUID) | Primary key |
| userId | varchar | Foreign key ke users |
| locationId | varchar | Foreign key ke locations |
| locationName | text | Nama lokasi |
| region | text | Wilayah |
| date | text | Tanggal kunjungan |
| time | text | Waktu kunjungan |
| ticketType | text | Tipe tiket (Wisatawan Lokal/Asing) |
| participants | integer | Jumlah peserta |
| status | text | Status tiket (active/used/expired) |
| qrCode | text | Data QR code |
| paymentMethod | text | Metode pembayaran (qris/bank_transfer) |
| paymentStatus | text | Status pembayaran (pending/paid/expired) |
| paymentDeadline | timestamp | Batas waktu pembayaran (7 jam) |
| totalPrice | integer | Total harga |
| createdAt | timestamp | Tanggal pembelian |

### 4. tripBuddies
Listing trip untuk mencari teman perjalanan.

| Column | Type | Description |
|--------|------|-------------|
| id | varchar (UUID) | Primary key |
| userId | varchar | Foreign key ke users |
| name | text | Nama pembuat trip |
| initials | text | Inisial nama |
| destination | text | Destinasi tujuan |
| dateRange | text | Rentang tanggal |
| budget | text | Estimasi budget |
| tripType | text | Tipe trip (diving/snorkeling/dll) |
| participants | integer | Peserta saat ini |
| maxParticipants | integer | Maksimal peserta |

### 5. seaLogPosts
Postingan komunitas Sea-Log.

| Column | Type | Description |
|--------|------|-------------|
| id | varchar (UUID) | Primary key |
| userId | varchar | Foreign key ke users |
| username | text | Username pembuat |
| initials | text | Inisial nama |
| location | text | Lokasi foto |
| image | text | URL gambar |
| caption | text | Caption postingan |
| likes | integer | Jumlah likes |
| comments | integer | Jumlah komentar |
| timeAgo | text | Waktu posting |

### 6. events
Event dan webinar konservasi.

| Column | Type | Description |
|--------|------|-------------|
| id | varchar (UUID) | Primary key |
| title | text | Judul event |
| date | text | Tanggal event |
| time | text | Waktu event |
| location | text | Lokasi/platform |
| type | text | Tipe event |
| participants | integer | Peserta terdaftar |
| maxParticipants | integer | Kapasitas maksimal |
| image | text | URL gambar event |

### 7. coralAdoptions
Data adopsi karang.

| Column | Type | Description |
|--------|------|-------------|
| id | varchar (UUID) | Primary key |
| userId | varchar | Foreign key ke users |
| species | text | Spesies karang |
| adoptedBy | text | Nama pengadopsi |
| adoptedDate | text | Tanggal adopsi |
| status | text | Status pertumbuhan |
| x | integer | Koordinat X di peta |
| y | integer | Koordinat Y di peta |

### 8. locationStamps
Stamp lokasi yang dikunjungi (Sea-Passport).

| Column | Type | Description |
|--------|------|-------------|
| id | varchar (UUID) | Primary key |
| userId | varchar | Foreign key ke users |
| locationId | varchar | Foreign key ke locations |
| locationName | text | Nama lokasi |
| region | text | Wilayah |
| visitDate | text | Tanggal kunjungan |
| image | text | Gambar stamp |

### 9. impactStats
Statistik dampak konservasi (singleton).

| Column | Type | Description |
|--------|------|-------------|
| id | varchar | Primary key ("main") |
| totalPnbp | text | Total PNBP terkumpul |
| totalPnbpChange | text | Perubahan PNBP |
| coralsAdopted | integer | Total karang diadopsi |
| coralsChange | text | Perubahan adopsi |
| patrolsFunded | integer | Patroli yang didanai |
| patrolsChange | text | Perubahan patroli |
| consciousTourists | integer | Turis sadar konservasi |
| touristsChange | text | Perubahan jumlah turis |

### 10. sessions
Session untuk autentikasi.

| Column | Type | Description |
|--------|------|-------------|
| sid | varchar | Primary key (session ID) |
| sess | jsonb | Data session |
| expire | timestamp | Waktu expired |

## Setup Database

### Development
Database PostgreSQL di-manage oleh Replit. Connection string ada di environment variable `DATABASE_URL`.

### Migration
```bash
npm run db:push
```

### Seed Data
Data lokasi (20 destinasi) di-seed otomatis saat server pertama kali dijalankan. Lihat `server/storage.ts` untuk detail implementasi.

## Environment Variables

| Variable | Description |
|----------|-------------|
| DATABASE_URL | PostgreSQL connection string |
| PGHOST | Database host |
| PGPORT | Database port |
| PGUSER | Database user |
| PGPASSWORD | Database password |
| PGDATABASE | Database name |
