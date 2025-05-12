import Image from "next/image";

export default function AboutUsPage() {
  return (
    <main className="bg-[#fef9ef] text-gray-900">
        <section className="max-w-6xl mx-auto px-6 py-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Venzor,</h1>
            <p className="text-base md:text-lg max-w-3xl leading-relaxed">
            Welcome to Venzor, Sri Lanka's first dedicated e-marketplace for event
            service providers. Born from a deep understanding of the challenges
            faced by new and small businesses in the event industry, Venzor
            empowers vendors and connects them with clients through a trusted,
            transparent, and user-friendly platform. Whether you're planning a
            wedding, a corporate event, or a private celebration, Venzor makes it
            easy to discover verified service providers, compare offers, and book
            with confidence.
            </p>
            <p className="text-base md:text-lg mt-4 max-w-3xl leading-relaxed">
            We bridge the gap between talent and opportunity, boosting visibility
            for MSMEs while making event planning simpler, smarter, and
            stress-free.
            </p>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Image
                src="/images/about-us01.jpg"
                alt="pic01"
                width={300}
                height={200}
                className="rounded shadow-md"
            />
            <Image
                src="/images/about-us02.jpg"
                alt="pic02"
                width={300}
                height={200}
                className="rounded shadow-md"
            />
            <Image
                src="/images/about-us03.jpg"
                alt="pic03"
                width={300}
                height={200}
                className="rounded shadow-md"
            />
            </div>
        </section>

      <section className="bg-[#fff9e7] py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
          {/* Left - vertical label and block */}
          <div className="relative">
            <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 rotate-[-90deg] text-3xl font-bold text-[#bd8d4c]">
              Our Story
            </div>
            <div className="bg-[#D39D55] w-64 h-96 rounded" />
          </div>

          {/* Right - Vision and Mission */}
          <div className="space-y-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <svg
                  className="w-6 h-6 text-[#cfc34d]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L20 20H4L12 2Z" />
                </svg>
                <h2 className="text-2xl font-bold">Vision</h2>
              </div>
              <p className="text-gray-700 text-base">
                "To be Sri Lanka’s leading event marketplace, bridging the gap
                between clients and vendors by fostering trust, accessibility,
                and innovation in event planning."
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-2">
                <svg
                  className="w-6 h-6 text-[#cfc34d]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 2L12 22L18 2H6Z" />
                </svg>
                <h2 className="text-2xl font-bold">Mission</h2>
              </div>
              <p className="text-gray-700 text-base">
                "Our mission is to empower event service providers and clients
                by offering a seamless, secure, and efficient platform. We aim
                to enhance visibility for MSMEs, simplify vendor discovery for
                clients, and build a trusted community that transforms event
                planning into a hassle-free experience."
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
