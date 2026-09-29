import type { Activity, Book, Loan, Member, Photo, Proker } from "./types";

const photoUrl = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=82`;

export const photos: Photo[] = [
  {
    id: "photo-01",
    url: photoUrl("photo-1481627834876-b7833e8f5570"),
    caption: "Rak baca yang selalu terbuka untuk warga.",
    relatedActivityId: null,
    createdAt: "2026-01-10",
  },
  {
    id: "photo-02",
    url: photoUrl("photo-1507842217343-583bb7270b66"),
    caption: "Sudut buku anak pada pagi hari.",
    relatedActivityId: "activity-literasi",
    createdAt: "2026-02-08",
  },
  {
    id: "photo-03",
    url: photoUrl("photo-1529390079861-591de354faf5"),
    caption: "Membaca bersama di halaman balai desa.",
    relatedActivityId: "activity-literasi",
    createdAt: "2026-02-08",
  },
  {
    id: "photo-04",
    url: photoUrl("photo-1511108690759-009324a90311"),
    caption: "Cerita tumbuh dari suara dan imajinasi.",
    relatedActivityId: "activity-dongeng",
    createdAt: "2026-03-02",
  },
  {
    id: "photo-05",
    url: photoUrl("photo-1497633762265-9d179a990aa6"),
    caption: "Bedah buku bersama warga dan pegiat literasi.",
    relatedActivityId: "activity-bedah",
    createdAt: "2026-04-18",
  },
  {
    id: "photo-06",
    url: photoUrl("photo-1506880018603-83d5b814b5a6"),
    caption: "Buku-buku baru dari gerakan donasi warga.",
    relatedActivityId: "activity-donasi",
    createdAt: "2026-05-12",
  },
  {
    id: "photo-07",
    url: photoUrl("photo-1543002588-bfa74002ed7e"),
    caption: "Perpustakaan datang menyapa dusun.",
    relatedActivityId: "activity-keliling",
    createdAt: "2026-06-09",
  },
];

export const books: Book[] = [
  {
    id: "book-01",
    title: "Laskar Pelangi",
    author: "Andrea Hirata",
    category: "Novel Indonesia",
    isbn: "978-979-3062-79-8",
    coverUrl: photoUrl("photo-1544947950-fa07a98d237f"),
    stock: 5,
    availableStock: 2,
    publishedYear: 2005,
    synopsis:
      "Kisah sepuluh anak Belitung yang menjaga mimpi mereka melalui sekolah sederhana dan persahabatan.",
    createdAt: "2025-08-10",
  },
  {
    id: "book-02",
    title: "Bumi Manusia",
    author: "Pramoedya Ananta Toer",
    category: "Sejarah & Sastra",
    isbn: "978-979-97312-3-0",
    coverUrl: photoUrl("photo-1495446815901-a7297e633e8d"),
    stock: 4,
    availableStock: 1,
    publishedYear: 1980,
    synopsis:
      "Roman sejarah tentang Minke, pendidikan, dan pergulatan martabat di awal abad kedua puluh.",
    createdAt: "2025-08-12",
  },
  {
    id: "book-03",
    title: "Filosofi Teras",
    author: "Henry Manampiring",
    category: "Pengembangan Diri",
    isbn: "978-602-412-518-9",
    coverUrl: photoUrl("photo-1512820790803-83ca734da794"),
    stock: 6,
    availableStock: 5,
    publishedYear: 2018,
    synopsis:
      "Pengantar praktis untuk menjalani hidup yang lebih tenang melalui filsafat Stoa.",
    createdAt: "2025-09-02",
  },
  {
    id: "book-04",
    title: "Atlas Flora Nusantara",
    author: "R. B. Prasetya",
    category: "Alam & Sains",
    isbn: "978-623-99121-4-5",
    coverUrl: photoUrl("photo-1497250681960-ef046c08a56e"),
    stock: 3,
    availableStock: 0,
    publishedYear: 2022,
    synopsis:
      "Mengenal tumbuhan Nusantara melalui catatan lapangan yang kaya ilustrasi.",
    createdAt: "2025-10-01",
  },
  {
    id: "book-05",
    title: "Dongeng dari Bukit",
    author: "Nina Kurnia",
    category: "Anak",
    isbn: "978-623-889-101-9",
    coverUrl: photoUrl("photo-1481627834876-b7833e8f5570"),
    stock: 8,
    availableStock: 7,
    publishedYear: 2023,
    synopsis:
      "Kumpulan dongeng hangat dari berbagai sudut desa untuk dibacakan sebelum tidur.",
    createdAt: "2025-10-22",
  },
  {
    id: "book-06",
    title: "Membaca Sawah",
    author: "Agus Wibowo",
    category: "Pertanian",
    isbn: "978-623-812-008-9",
    coverUrl: photoUrl("photo-1501004318641-b39e6451bec6"),
    stock: 4,
    availableStock: 3,
    publishedYear: 2021,
    synopsis:
      "Panduan ringan memahami musim, tanah, dan pengetahuan tani yang diwariskan.",
    createdAt: "2025-11-04",
  },
];

export const members: Member[] = [
  {
    id: "member-01",
    name: "Siti Rahma",
    memberCode: "PDS-0001",
    contact: "0812-5550-0188",
    address: "Dusun Krajan RT 02",
    joinDate: "2024-01-12",
    status: "active",
    createdAt: "2024-01-12",
  },
  {
    id: "member-02",
    name: "Bima Pratama",
    memberCode: "PDS-0002",
    contact: "0813-2022-1800",
    address: "Dusun Sumberrejo RT 04",
    joinDate: "2024-03-21",
    status: "active",
    createdAt: "2024-03-21",
  },
  {
    id: "member-03",
    name: "Nadia Aulia",
    memberCode: "PDS-0003",
    contact: "0851-8992-4421",
    address: "Dusun Krajan RT 05",
    joinDate: "2025-02-03",
    status: "overdue",
    createdAt: "2025-02-03",
  },
  {
    id: "member-04",
    name: "Pak Slamet",
    memberCode: "PDS-0004",
    contact: "0821-4432-5006",
    address: "Dusun Pucang RT 01",
    joinDate: "2025-08-19",
    status: "active",
    createdAt: "2025-08-19",
  },
];

export const loans: Loan[] = [
  {
    id: "loan-01",
    bookId: "book-01",
    memberId: "member-01",
    borrowedAt: "2026-09-15",
    dueAt: "2026-09-29",
    returnedAt: null,
    status: "due-soon",
    createdAt: "2026-09-15",
  },
  {
    id: "loan-02",
    bookId: "book-02",
    memberId: "member-01",
    borrowedAt: "2026-08-24",
    dueAt: "2026-09-07",
    returnedAt: "2026-09-05",
    status: "returned",
    createdAt: "2026-08-24",
  },
  {
    id: "loan-03",
    bookId: "book-04",
    memberId: "member-03",
    borrowedAt: "2026-08-28",
    dueAt: "2026-09-11",
    returnedAt: null,
    status: "overdue",
    createdAt: "2026-08-28",
  },
  {
    id: "loan-04",
    bookId: "book-06",
    memberId: "member-02",
    borrowedAt: "2026-09-18",
    dueAt: "2026-10-02",
    returnedAt: null,
    status: "borrowed",
    createdAt: "2026-09-18",
  },
];

export const activities: Activity[] = [
  {
    id: "activity-literasi",
    title: "Gerakan Literasi Desa",
    slug: "gerakan-literasi-desa",
    date: "2026-10-05",
    description:
      "Pagi membaca bersama untuk anak, orang tua, dan siapa pun yang ingin singgah.",
    fullDescription:
      "Gerakan Literasi Desa adalah ruang baca bersama di halaman balai desa. Kami membuka tikar, membawa buku-buku pilihan, lalu membaca dan berbagi cerita bersama warga. Kegiatan ini menjadi pintu kecil untuk membangun kebiasaan membaca di rumah.",
    coverPhotoId: "photo-03",
    photoIds: ["photo-02", "photo-03"],
    createdAt: "2026-02-01",
  },
  {
    id: "activity-dongeng",
    title: "Lomba Mendongeng Anak",
    slug: "lomba-mendongeng-anak",
    date: "2026-10-19",
    description:
      "Panggung kecil untuk suara besar dan imajinasi anak-anak desa.",
    fullDescription:
      "Anak-anak kelas 3 sampai 6 SD akan membawakan dongeng pilihan mereka. Selain lomba, ada lokakarya singkat agar orang tua dapat meneruskan kebiasaan mendongeng di rumah.",
    coverPhotoId: "photo-04",
    photoIds: ["photo-04"],
    createdAt: "2026-03-01",
  },
  {
    id: "activity-bedah",
    title: "Bedah Buku: Suara dari Desa",
    slug: "bedah-buku-suara-dari-desa",
    date: "2026-08-17",
    description:
      "Membaca ulang cerita-cerita yang dekat dengan hidup dan tanah kita.",
    fullDescription:
      "Sesi diskusi terbuka bersama pembaca, guru, dan pegiat desa. Tidak perlu menyelesaikan buku untuk ikut; cukup datang dengan rasa ingin tahu dan satu cerita yang ingin dibagi.",
    coverPhotoId: "photo-05",
    photoIds: ["photo-05"],
    createdAt: "2026-04-01",
  },
  {
    id: "activity-donasi",
    title: "Donasi Buku Warga",
    slug: "donasi-buku-warga",
    date: "2026-07-12",
    description: "Mengumpulkan buku layak baca agar rak kita terus bertumbuh.",
    fullDescription:
      "Warga menitipkan buku yang telah selesai dibaca untuk menemukan pembaca baru. Setiap buku diperiksa, dicatat, dan diberi rumah baru di rak Perpustakaan Desa.",
    coverPhotoId: "photo-06",
    photoIds: ["photo-06"],
    createdAt: "2026-05-01",
  },
  {
    id: "activity-keliling",
    title: "Perpustakaan Keliling",
    slug: "perpustakaan-keliling",
    date: "2026-06-09",
    description: "Buku datang ke dusun-dusun yang paling jauh dari rak utama.",
    fullDescription:
      "Tim relawan membawa kotak-kotak buku pilihan ke pos ronda dan rumah warga. Kunjungan ini memastikan jarak tidak menjadi alasan untuk berhenti membaca.",
    coverPhotoId: "photo-07",
    photoIds: ["photo-07"],
    createdAt: "2026-05-15",
  },
];

export const prokers: Proker[] = [
  {
    id: "proker-01",
    title: "Satu Rumah Satu Kartu Baca",
    description:
      "Memperluas keanggotaan agar setiap keluarga punya akses langsung ke rak perpustakaan.",
    period: "Jan–Des 2026",
    status: "ongoing",
    progress: 68,
    createdAt: "2026-01-01",
  },
  {
    id: "proker-02",
    title: "Kelas Baca Sabtu",
    description: "Pendampingan baca mingguan untuk anak usia 7–12 tahun.",
    period: "Feb–Nov 2026",
    status: "ongoing",
    progress: 54,
    createdAt: "2026-01-15",
  },
  {
    id: "proker-03",
    title: "Pojok Baca Dusun",
    description:
      "Membuka tiga titik baca kecil di dusun yang jauh dari balai desa.",
    period: "Okt–Des 2026",
    status: "planned",
    progress: 20,
    createdAt: "2026-06-10",
  },
  {
    id: "proker-04",
    title: "Katalogisasi Rak Utama",
    description:
      "Merapikan data dan label koleksi agar buku lebih mudah ditemukan.",
    period: "Jan–Jun 2026",
    status: "completed",
    progress: 100,
    createdAt: "2026-01-05",
  },
];
