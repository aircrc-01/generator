import { forwardRef } from "react";

const Certificate = forwardRef(
  (
    {
      topicName = "Advanced Academic Writing Workshop",
      resourcePerson = "Dr. John Smith",
      participantName = "MUHAMMAD AHMAD",
      eventDate = "May 14, 2026",
      organizedBy = "TESOL Society",
      organizerName = "Department of English",
      date = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}assets/outer.png)`,
        }}
        className="w-[1123px] h-[794px] relative overflow-hidden shadow-2xl bg-cover bg-center bg-no-repeat"
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-[rgba(255,255,255,0.08)]" />

        {/* Decorative Shapes */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#93c5fd] rounded-full translate-x-24 -translate-y-24 opacity-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#93c5fd] rounded-full -translate-x-28 translate-y-28 opacity-15" />
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-[#dbeafe] rounded-full opacity-10" />
        <div className="absolute bottom-1/4 right-24 w-40 h-40 bg-[#dbeafe] rounded-full opacity-10" />

        {/* Top Logos Row */}
        <div className="absolute top-10 left-0 right-0 z-10 flex items-center justify-between px-12">
          {/* Left Logo */}
          <div className="w-38 h-36 rounded-[10px] bg-white shadow-xl overflow-hidden ring-[4px] ring-[#dbeafe]">
            <img
              src={`${import.meta.env.BASE_URL}assets/Air.jpeg`}
              alt="Left Logo"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Center Logo */}
          <div className="w-36 h-36 rounded-full border-[4px] border-[#1d4ed8] bg-white shadow-xl overflow-hidden ring-[4px] ring-[#dbeafe]">
            <img
              src={`${import.meta.env.BASE_URL}assets/Tesol.jpeg`}
              alt="Center Logo"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Logo */}
          <div className="w-36 h-36 rounded-full border-[4px] border-[#1d4ed8] bg-white shadow-xl overflow-hidden ring-[4px] ring-[#dbeafe]">
            <img
              src={`${import.meta.env.BASE_URL}assets/English.jpeg`}
              alt="Right Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Current Date */}
        <div className="absolute top-48 left-16 z-10 text-white text-lg font-serif">
          <p>
            <span className="font-semibold text-white">Date:</span> {date}
          </p>
        </div>

        {/* Main Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-12 text-center pt-25">
          {/* Title */}
          <h1 className="text-6xl font-bold text-[#1d4ed8] font-serif mb-6">
            Certificate of Participation
          </h1>

          {/* Subtitle */}
          <p className="text-2xl text-[#475569] font-serif mb-6">
            This certificate is presented to
          </p>

          {/* Participant Name */}
          <h2 className="participant-name text-5xl font-bold text-[#0f172a] font-serif tracking-wide uppercase mb-6">
            {participantName}
          </h2>

          {/* Dynamic Body Text */}
          <p className="text-xl leading-relaxed text-[#475569] max-w-4xl font-serif mb-4">
            for participating in the workshop, held on{" "}
            <span className="font-semibold text-[#1e3a8a]">{eventDate}</span>,
            organized by{" "}
            <span className="font-semibold text-[#1e3a8a]">{organizedBy}</span>.
          </p>

          {/* Topic */}
          <p className="text-3xl font-bold italic text-[#1e3a8a] font-serif mb-8">
            Topic: "{topicName}"
          </p>

          {/* Resource Person and Organizer Name Side by Side */}
          <div className="w-full max-w-5xl grid grid-cols-2 gap-12 items-start">
            {/* Resource Person - Left */}
            <div className="text-left mb-4">
              <p className="text-2xl text-[#334155] font-serif">
                <span className="font-semibold text-[#1e3a8a]">
                  Resource Person:
                </span>{" "}
                {resourcePerson}
              </p>
            </div>

            {/* Organizer Name - Right */}
            <div className="text-right mb-4">
              <p className="text-2xl text-[#334155] font-serif">
                <span className="font-semibold text-[#1e3a8a]">Organizer:</span>{" "}
                {organizerName}
              </p>
            </div>
          </div>
        </div>

        {/* Signature Line */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10">
          <div className="w-72 border-t-[2px] border-[#1d4ed8]" />
        </div>
      </div>
    );
  },
);

Certificate.displayName = "Certificate";

export default Certificate;
