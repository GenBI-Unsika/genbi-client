import React from 'react';

/**
 * Komponen dasar shimmer/pulse untuk menyusun skeleton.
 */
const Shimmer = ({ className = '' }) => (
    <div className={`animate-pulse bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-lg ${className}`} />
);

/* ============================================================
   1. CardGridSkeleton
   Dipakai oleh: /events, /proker, /articles
   Layout: judul h1 + subjudul + dropdown filter (kanan), lalu
           grid 3 kolom berisi card gambar + teks + pagination.
   ============================================================ */
export const CardGridSkeleton = () => (
    <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Header + filter row */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div className="space-y-3">
                    <Shimmer className="h-9 w-64 max-w-xs" />
                    <Shimmer className="h-5 w-80 max-w-sm" />
                </div>
                {/* Dropdown filter placeholder */}
                <Shimmer className="h-10 w-36 rounded-lg shrink-0" />
            </div>

            {/* Card grid 1→2→3 kolom */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
                        {/* Gambar thumbnail */}
                        <Shimmer className="h-44 w-full rounded-none" />
                        <div className="p-4 space-y-2.5">
                            {/* Badge */}
                            <Shimmer className="h-5 w-16 rounded-full" />
                            {/* Judul */}
                            <Shimmer className="h-5 w-4/5" />
                            {/* Deskripsi 2 baris */}
                            <Shimmer className="h-3.5 w-full" />
                            <Shimmer className="h-3.5 w-3/4" />
                            {/* Meta: avatar + tanggal */}
                            <div className="flex items-center gap-2 pt-1">
                                <Shimmer className="h-6 w-6 rounded-full" />
                                <Shimmer className="h-3 w-24" />
                                <Shimmer className="h-3 w-16 ml-auto" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination row */}
            <div className="flex justify-center items-center gap-2">
                <Shimmer className="h-10 w-10 rounded-full" />
                <Shimmer className="h-10 w-10 rounded-full" />
                <Shimmer className="h-10 w-10 rounded-full" />
                <Shimmer className="h-10 w-10 rounded-full" />
                <Shimmer className="h-10 w-10 rounded-full" />
            </div>
        </div>
    </div>
);

/* ============================================================
   2. TeamsSkeleton
   Dipakai oleh: /teams
   Layout: judul + beberapa seksi divisi, masing-masing dengan
           sub-judul h2 + grid 4 kolom berisi avatar bulat+nama+jabatan.
   ============================================================ */
export const TeamsSkeleton = () => (
    <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Header */}
            <div className="mb-12 space-y-3">
                <Shimmer className="h-9 w-56" />
                <Shimmer className="h-5 w-72" />
            </div>

            {/* 2 divisi placeholder */}
            {Array.from({ length: 2 }).map((_, divIdx) => (
                <section key={divIdx} className="mb-16">
                    {/* Sub-judul divisi */}
                    <Shimmer className="h-7 w-48 mb-8" />
                    {/* Grid anggota 1→2→4 kolom */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center gap-3">
                                <Shimmer className="h-20 w-20 rounded-full" />
                                <Shimmer className="h-4 w-28" />
                                <Shimmer className="h-3 w-20" />
                            </div>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    </div>
);

/* ============================================================
   3. HistorySkeleton
   Dipakai oleh: /history
   Layout: judul h1 + sub-judul + gambar penuh + paragraf teks.
   ============================================================ */
export const HistorySkeleton = () => (
    <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Header */}
            <div className="mb-12 space-y-3">
                <Shimmer className="h-9 w-48" />
                <Shimmer className="h-5 w-80 max-w-full" />
            </div>

            {/* Gambar */}
            <Shimmer className="h-80 w-full rounded-lg mb-8" />

            {/* Body teks: paragraf */}
            <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Shimmer key={i} className={`h-4 ${i % 5 === 4 ? 'w-2/3' : 'w-full'}`} />
                ))}
                <div className="pt-2" />
                {Array.from({ length: 4 }).map((_, i) => (
                    <Shimmer key={`b${i}`} className={`h-4 ${i % 4 === 3 ? 'w-1/2' : 'w-full'}`} />
                ))}
            </div>
        </div>
    </div>
);

/* ============================================================
   4. ScholarshipInfoSkeleton
   Dipakai oleh: /scholarship (halaman info+syarat+dokumen)
   Layout: judul + 2 seksi list (persyaratan & dokumen) + tombol CTA.
   ============================================================ */
export const ScholarshipInfoSkeleton = () => (
    <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Header */}
            <div className="mb-12 space-y-3">
                <Shimmer className="h-9 w-3/4 max-w-lg" />
                <Shimmer className="h-5 w-full max-w-md" />
                <Shimmer className="h-5 w-4/5 max-w-md" />
            </div>

            {/* Seksi Persyaratan */}
            <div className="mb-12">
                <Shimmer className="h-7 w-36 mb-6" />
                <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex gap-2 items-start">
                            <Shimmer className="h-4 w-3 mt-0.5 rounded-sm shrink-0" />
                            <Shimmer className={`h-4 ${i === 2 ? 'w-3/4' : 'w-full'}`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Seksi Dokumen */}
            <div className="mb-12">
                <Shimmer className="h-7 w-52 mb-6" />
                <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex gap-2 items-start">
                            <Shimmer className="h-4 w-3 mt-0.5 rounded-sm shrink-0" />
                            <Shimmer className={`h-4 ${i === 2 ? 'w-1/2' : 'w-full'}`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA tombol terpusat */}
            <div className="flex justify-center">
                <Shimmer className="h-12 w-40 rounded-lg" />
            </div>
        </div>
    </div>
);

/* ============================================================
   5. ScholarshipSelectionSkeleton
   Dipakai oleh: /scholarship/selection/admin, /interview, /announcement
   Layout: judul + tabel/daftar kandidat.
   ============================================================ */
export const ScholarshipSelectionSkeleton = () => (
    <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="mb-8 space-y-3">
                <Shimmer className="h-8 w-72" />
                <Shimmer className="h-5 w-96 max-w-full" />
            </div>

            {/* Filter / tabs bar */}
            <div className="flex gap-3 mb-6">
                <Shimmer className="h-9 w-24 rounded-full" />
                <Shimmer className="h-9 w-24 rounded-full" />
                <Shimmer className="h-9 w-24 rounded-full" />
            </div>

            {/* Baris tabel header */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-4">
                <div className="flex items-center gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50">
                    <Shimmer className="h-4 w-8" />
                    <Shimmer className="h-4 w-28" />
                    <Shimmer className="h-4 w-20 ml-auto" />
                    <Shimmer className="h-4 w-20" />
                    <Shimmer className="h-4 w-24" />
                </div>

                {/* Baris data */}
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-b border-gray-50 last:border-0">
                        <Shimmer className="h-4 w-8" />
                        <div className="flex items-center gap-2 flex-1">
                            <Shimmer className="h-8 w-8 rounded-full shrink-0" />
                            <Shimmer className="h-4 w-36" />
                        </div>
                        <Shimmer className="h-4 w-20" />
                        <Shimmer className="h-6 w-20 rounded-full" />
                        <Shimmer className="h-8 w-24 rounded-lg" />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

/* ============================================================
   6. AnnouncementSkeleton
   Dipakai oleh: /scholarship/announcement (halaman publik dengan token)
   Layout: fullscreen card dengan banner atas + konten nama/npm + QR code.
   ============================================================ */
export const AnnouncementSkeleton = () => (
    <div className="h-screen flex items-center justify-center p-4 bg-slate-950">
        {/* Simulated blurry background */}
        <div className="absolute inset-0 bg-slate-900 opacity-80" />

        <div className="relative z-10 w-full max-w-5xl">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden border border-white">
                {/* Banner atas berwarna */}
                <div className="bg-gray-300 px-6 py-5 sm:px-12 sm:py-8 animate-pulse">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <div className="h-6 w-64 bg-gray-200 rounded" />
                            <div className="h-4 w-40 bg-gray-200 rounded" />
                        </div>
                        <div className="h-14 w-14 rounded-xl bg-gray-200" />
                    </div>
                </div>

                {/* Body: nama/info + QR */}
                <div className="px-6 py-6 sm:px-12 sm:py-8 flex flex-row gap-8 items-center">
                    <div className="flex-1 space-y-6">
                        <Shimmer className="h-5 w-24 rounded-full" />
                        <Shimmer className="h-12 w-72 max-w-full" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                            {Array.from({ length: 2 }).map((_, i) => (
                                <div key={i} className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
                                    <Shimmer className="h-8 w-8 rounded-full shrink-0" />
                                    <div className="space-y-1.5 flex-1">
                                        <Shimmer className="h-3 w-20" />
                                        <Shimmer className="h-4 w-32" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* QR code placeholder */}
                    <Shimmer className="h-40 w-40 shrink-0 rounded-xl" />
                </div>

                {/* Footer warning */}
                <div className="border-t border-slate-100 px-6 py-4 sm:px-12 flex items-center gap-3 bg-slate-50/50">
                    <Shimmer className="h-8 w-8 rounded-xl shrink-0" />
                    <Shimmer className="h-3 w-full" />
                </div>
            </div>
        </div>
    </div>
);

/* ============================================================
   7. AuthSkeleton
   Dipakai oleh: /signin, /signup, /forgot-password, /two-factor, /verify-email
   Layout: 2 kolom (ilustrasi kiri desktop) + form kanan.
   ============================================================ */
export const AuthSkeleton = () => (
    <div className="min-h-screen bg-white flex">
        {/* Kolom kiri - ilustrasi (desktop only) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gray-50 items-center justify-center p-12">
            <Shimmer className="h-80 w-80 rounded-2xl" />
        </div>

        {/* Kolom kanan - form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
            <div className="max-w-md w-full space-y-6">
                {/* Logo */}
                <div className="flex justify-center">
                    <Shimmer className="h-12 w-12 rounded-xl" />
                </div>

                {/* Judul */}
                <div className="text-center space-y-2">
                    <Shimmer className="h-8 w-3/4 mx-auto" />
                    <Shimmer className="h-4 w-1/2 mx-auto" />
                </div>

                {/* Field input */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Shimmer className="h-4 w-24" />
                        <Shimmer className="h-12 w-full rounded-lg" />
                    </div>
                    <div className="space-y-2">
                        <Shimmer className="h-4 w-20" />
                        <Shimmer className="h-12 w-full rounded-lg" />
                    </div>
                </div>

                {/* Tombol submit */}
                <Shimmer className="h-12 w-full rounded-lg" />

                {/* Divider */}
                <div className="flex items-center gap-3">
                    <Shimmer className="h-px flex-1" />
                    <Shimmer className="h-4 w-16" />
                    <Shimmer className="h-px flex-1" />
                </div>

                {/* Google button */}
                <Shimmer className="h-12 w-full rounded-lg" />
            </div>
        </div>
    </div>
);

/* ============================================================
   8. ProfileSkeleton
   Dipakai oleh: /profile (dan nested routes child)
   Layout: sidebar kiri (avatar+menu) + konten kanan berupa form field.
   ============================================================ */
export const ProfileSkeleton = () => (
    <div className="min-h-[calc(100vh-72px)] w-full max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-6">
            {/* Sidebar */}
            <div className="hidden md:flex flex-col w-64 shrink-0 space-y-3">
                {/* Avatar + nama + email */}
                <div className="flex flex-col items-center p-4 space-y-3">
                    <Shimmer className="h-20 w-20 rounded-full" />
                    <Shimmer className="h-5 w-32" />
                    <Shimmer className="h-4 w-40" />
                </div>
                {/* Menu items */}
                <div className="space-y-2 px-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
                            <Shimmer className="h-8 w-8 rounded-xl shrink-0" />
                            <Shimmer className="h-4 w-28" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Konten utama */}
            <div className="flex-1 space-y-5">
                <Shimmer className="h-7 w-40" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Shimmer className="h-4 w-28" />
                            <Shimmer className="h-11 w-full rounded-lg" />
                        </div>
                    ))}
                </div>
                <Shimmer className="h-11 w-32 rounded-lg" />
            </div>
        </div>
    </div>
);

/* ============================================================
   9. FormSkeleton
   Dipakai oleh: /scholarship/register, /events/:id/register
   Layout: judul + step indicator + form fields + tombol aksi.
   ============================================================ */
export const FormSkeleton = () => (
    <div className="min-h-[calc(100vh-72px)] w-full max-w-3xl mx-auto px-4 py-10">
        {/* Judul */}
        <div className="space-y-2 mb-8">
            <Shimmer className="h-8 w-1/2" />
            <Shimmer className="h-4 w-3/4" />
        </div>

        {/* Step indicator */}
        <div className="flex gap-2 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
                <Shimmer key={i} className="h-2 flex-1 rounded-full" />
            ))}
        </div>

        {/* Form fields */}
        <div className="space-y-5">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <Shimmer className="h-4 w-36" />
                    <Shimmer className="h-11 w-full rounded-lg" />
                </div>
            ))}
        </div>

        {/* Tombol aksi */}
        <div className="flex justify-between mt-8">
            <Shimmer className="h-11 w-28 rounded-lg" />
            <Shimmer className="h-11 w-28 rounded-lg" />
        </div>
    </div>
);

/* ============================================================
   10. DetailSkeleton
   Dipakai oleh: /articles/:slug, /events/:eventId, /proker/:eventId
   Layout: breadcrumb + hero image + judul + meta + body teks + sidebar.
   ============================================================ */
export const DetailSkeleton = () => (
    <div className="min-h-[calc(100vh-72px)] w-full max-w-5xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <div className="flex gap-2 mb-6 items-center">
            <Shimmer className="h-4 w-16" />
            <Shimmer className="h-4 w-4 rounded" />
            <Shimmer className="h-4 w-32" />
        </div>

        {/* Hero image */}
        <Shimmer className="h-64 sm:h-80 w-full rounded-2xl mb-8" />

        <div className="flex gap-8">
            {/* Konten utama */}
            <div className="flex-1 space-y-4">
                <Shimmer className="h-9 w-5/6" />
                <Shimmer className="h-9 w-3/4" />

                {/* Meta (author, date) */}
                <div className="flex gap-4 items-center pt-2">
                    <Shimmer className="h-8 w-8 rounded-full" />
                    <Shimmer className="h-4 w-32" />
                    <Shimmer className="h-4 w-24" />
                </div>

                {/* Body teks */}
                <div className="space-y-3 pt-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Shimmer key={i} className={`h-4 ${i % 4 === 3 ? 'w-2/3' : 'w-full'}`} />
                    ))}
                </div>
            </div>

            {/* Sidebar (desktop only) */}
            <div className="hidden lg:flex flex-col w-64 shrink-0 space-y-4">
                <Shimmer className="h-5 w-32" />
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Shimmer className="h-32 w-full rounded-xl" />
                        <Shimmer className="h-4 w-5/6" />
                        <Shimmer className="h-3 w-1/2" />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

/* ============================================================
   Default export: dipakai sebagai "generic" fallback terakhir
   jika ada route baru yang belum diassign skeleton spesifik.
   ============================================================ */
const PageSkeleton = CardGridSkeleton;
export default PageSkeleton;
