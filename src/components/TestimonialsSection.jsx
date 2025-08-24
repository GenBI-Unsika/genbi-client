"use client"

import { useState } from "react"

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      name: "Arif Syarifudin",
      role: "Alumni GenBI Unsika",
      image: "/placeholder.svg?height=80&width=80",
      quote:
        "Pengalaman menjadi bagian dari GenBI sangat berharga. Saya belajar banyak tentang kepemimpinan, kerjasama tim, dan pengabdian kepada masyarakat. Program-program yang ada sangat membantu dalam pengembangan soft skill dan hard skill.",
    },
    {
      name: "Siti Nurhaliza",
      role: "Alumni GenBI Unsika",
      image: "/placeholder.svg?height=80&width=80",
      quote:
        "GenBI memberikan kesempatan luar biasa untuk berkembang dan berkontribusi. Melalui berbagai kegiatan, saya dapat mengasah kemampuan public speaking, manajemen proyek, dan membangun jaringan yang luas.",
    },
    {
      name: "Ahmad Fauzi",
      role: "Alumni GenBI Unsika",
      image: "/placeholder.svg?height=80&width=80",
      quote:
        "Bergabung dengan GenBI adalah keputusan terbaik selama kuliah. Tidak hanya mendapat beasiswa, tapi juga pengalaman organisasi yang sangat berharga untuk karir di masa depan.",
    },
  ]

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-primary-900 text-center mb-12">Pengalaman Alumni</h2>

        <div className="relative">
          <div className="bg-gray-50 rounded-2xl p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Left side - Title */}
              <div className="lg:w-1/3">
                <h3 className="text-2xl font-bold text-primary-900 mb-4">Bagaimana Pendapat Alumni GenBI Unsika</h3>
                <p className="text-gray-600">
                  Yuk, cari tahu bagaimana pengalaman alumni dalam mengikuti program GenBI Unsika
                </p>
              </div>

              {/* Right side - Testimonial */}
              <div className="lg:w-2/3 relative">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  {/* Quote marks */}
                  <div className="text-4xl text-primary-200 mb-4">"</div>

                  {/* Testimonial content */}
                  <p className="text-gray-700 mb-6 leading-relaxed">{testimonials[currentTestimonial].quote}</p>

                  {/* Author */}
                  <div className="flex items-center">
                    <img
                      src={testimonials[currentTestimonial].image || "/placeholder.svg"}
                      alt={testimonials[currentTestimonial].name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</h4>
                      <p className="text-sm text-gray-600">{testimonials[currentTestimonial].role}</p>
                    </div>
                  </div>
                </div>

                {/* Navigation buttons */}
                <div className="flex justify-center mt-6 space-x-4">
                  <button
                    onClick={prevTestimonial}
                    className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Dots indicator */}
                <div className="flex justify-center mt-4 space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentTestimonial ? "bg-primary-500" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
