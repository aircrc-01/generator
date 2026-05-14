import { useState, useCallback, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { createRoot } from "react-dom/client";
import Certificate from "./Certificate";

const STORAGE_KEY = "certificate-generator-form-data";

const DEFAULT_FORM_DATA = {
  topicName: "",
  resourcePerson: "",
  eventDate: "",
  organizedBy: "",
  organizerName: "",
  participants: Array(10).fill(""),
};

// Helper to safely load from localStorage
const loadFormData = () => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (!savedData) {
      return DEFAULT_FORM_DATA;
    }

    const parsedData = JSON.parse(savedData);

    // Ensure participants is always an array of exactly 10 strings
    const participants = Array.from({ length: 10 }, (_, index) => {
      return parsedData.participants?.[index] ?? "";
    });

    return {
      ...DEFAULT_FORM_DATA,
      ...parsedData,
      participants,
    };
  } catch (error) {
    console.error("Failed to load saved form data:", error);
    return DEFAULT_FORM_DATA;
  }
};

const AdminHandle = () => {
  // Load from localStorage immediately on mount
  const [formData, setFormData] = useState(loadFormData);

  // Save to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (error) {
      console.error("Failed to save form data:", error);
    }
  }, [formData]);

  // Handle normal input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle participant name changes
  const handleParticipantChange = (index, value) => {
    setFormData((prev) => {
      const updatedParticipants = [...prev.participants];
      updatedParticipants[index] = value;

      return {
        ...prev,
        participants: updatedParticipants,
      };
    });
  };

  // Clear all saved data
  const clearAllData = () => {
    if (!window.confirm("Are you sure you want to clear all saved data?")) {
      return;
    }

    localStorage.removeItem(STORAGE_KEY);

    setFormData({
      ...DEFAULT_FORM_DATA,
      participants: Array(10).fill(""),
    });
  };

  // Generate a single certificate PDF
  const generateSinglePDF = useCallback(
    async (participantName) => {
      if (!participantName.trim()) return null;

      return new Promise((resolve) => {
        const wrapper = document.createElement("div");
        wrapper.style.position = "fixed";
        wrapper.style.left = "-99999px";
        wrapper.style.top = "0";
        wrapper.style.width = "1123px";
        wrapper.style.height = "794px";
        wrapper.style.background = "#ffffff";
        document.body.appendChild(wrapper);

        const root = document.createElement("div");
        root.style.width = "1123px";
        root.style.height = "794px";
        wrapper.appendChild(root);

        const rootInstance = createRoot(root);

        // Render a fresh certificate for this participant
        rootInstance.render(
          <Certificate
            topicName={
              formData.topicName || "Advanced Academic Writing Workshop"
            }
            resourcePerson={formData.resourcePerson || "Dr. John Smith"}
            eventDate={formData.eventDate || "May 14, 2026"}
            organizedBy={formData.organizedBy || "TESOL Society"}
            organizerName={formData.organizerName || "Department of English"}
            participantName={participantName.toUpperCase()}
          />,
        );

        setTimeout(async () => {
          try {
            // Wait for all images to load
            const images = root.querySelectorAll("img");

            await Promise.all(
              Array.from(images).map((img) => {
                if (img.complete) return Promise.resolve();

                return new Promise((res, rej) => {
                  img.onload = res;
                  img.onerror = rej;
                });
              }),
            );

            // Wait for layout/fonts to settle
            await new Promise((r) => setTimeout(r, 300));

            // Render the certificate to a canvas
            const canvas = await html2canvas(root, {
              scale: 2,
              useCORS: true,
              allowTaint: true,
              backgroundColor: "#ffffff",
              width: 1123,
              height: 794,
            });

            const imgData = canvas.toDataURL("image/png");

            // Create PDF in landscape mode
            const pdf = new jsPDF({
              orientation: "landscape",
              unit: "px",
              format: [1123, 794],
            });

            // Get actual PDF page size
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            // Certificate dimensions
            const certificateWidth = 1123;
            const certificateHeight = 794;

            // Center position
            const x = (pageWidth - certificateWidth) / 2;
            const y = (pageHeight - certificateHeight) / 2;

            // Add image centered
            pdf.addImage(
              imgData,
              "PNG",
              x,
              y,
              certificateWidth,
              certificateHeight,
            );

            // Filename: PARTICIPANT-NAME-Certificate.pdf
            const fileName = `${participantName
              .trim()
              .replace(/\s+/g, "-")
              .toUpperCase()}-Certificate.pdf`;

            // Save PDF
            pdf.save(fileName);

            // Cleanup
            rootInstance.unmount();
            if (wrapper.parentNode) {
              document.body.removeChild(wrapper);
            }

            resolve(fileName);
          } catch (error) {
            console.error(
              `PDF generation failed for ${participantName}:`,
              error,
            );

            rootInstance.unmount();
            if (wrapper.parentNode) {
              document.body.removeChild(wrapper);
            }

            resolve(null);
          }
        }, 500);
      });
    },
    [
      formData.topicName,
      formData.resourcePerson,
      formData.eventDate,
      formData.organizedBy,
      formData.organizerName,
    ],
  );

  // Generate PDFs for all entered participants
  const generatePDFs = async () => {
    const validParticipants = formData.participants.filter(
      (name) => name.trim() !== "",
    );

    if (validParticipants.length === 0) {
      alert("Please enter at least one participant name.");
      return;
    }

    for (let i = 0; i < validParticipants.length; i++) {
      await generateSinglePDF(validParticipants[i]);

      // Delay between downloads to avoid browser blocking
      if (i < validParticipants.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
    }

    alert(`Successfully generated ${validParticipants.length} certificate(s)!`);
  };

  // Participant shown in live preview
  const firstValidParticipant =
    formData.participants.find((name) => name.trim() !== "") ||
    "MUHAMMAD AHMAD";

  return (
    <div className="min-h-screen bg-[#fff7ec] p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Admin Panel */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-5 border-t-8 border-[#FFAC1C]">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-[#FFAC1C]">
              Certificate Generator
            </h2>

            <button
              type="button"
              onClick={clearAllData}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition"
            >
              Clear Data
            </button>
          </div>

          {/* Form Inputs */}
          <input
            type="text"
            name="topicName"
            value={formData.topicName}
            onChange={handleChange}
            placeholder="Certificate Topic Name"
            className="w-full border border-gray-300 rounded-lg px-4 py-3"
          />

          <input
            type="text"
            name="resourcePerson"
            value={formData.resourcePerson}
            onChange={handleChange}
            placeholder="Resource Person Name"
            className="w-full border border-gray-300 rounded-lg px-4 py-3"
          />

          <input
            type="text"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            placeholder="Workshop Held On (e.g. May 14, 2026)"
            className="w-full border border-gray-300 rounded-lg px-4 py-3"
          />

          <input
            type="text"
            name="organizedBy"
            value={formData.organizedBy}
            onChange={handleChange}
            placeholder="Organized By"
            className="w-full border border-gray-300 rounded-lg px-4 py-3"
          />

          <input
            type="text"
            name="organizerName"
            value={formData.organizerName}
            onChange={handleChange}
            placeholder="Organizer Name"
            className="w-full border border-gray-300 rounded-lg px-4 py-3"
          />

          {/* Participant Inputs */}
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {formData.participants.map((name, index) => (
              <input
                key={index}
                type="text"
                value={name}
                onChange={(e) => handleParticipantChange(index, e.target.value)}
                placeholder={`Participant ${index + 1} name`}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
              />
            ))}
          </div>

          {/* Generate Button */}
          <button
            type="button"
            onClick={generatePDFs}
            className="w-full bg-[#FFAC1C] hover:bg-[#e89910] text-white font-bold py-4 rounded-lg transition"
          >
            Generate All Certificates PDF
          </button>
        </div>

        {/* Live Preview */}
        <div className="overflow-auto bg-gray-100 rounded-2xl p-4 shadow-inner">
          <div className="scale-[0.55] origin-top-left">
            <Certificate
              topicName={
                formData.topicName || "Advanced Academic Writing Workshop"
              }
              resourcePerson={formData.resourcePerson || "Dr. John Smith"}
              eventDate={formData.eventDate || "May 14, 2026"}
              organizedBy={formData.organizedBy || "TESOL Society"}
              organizerName={formData.organizerName || "Department of English"}
              participantName={firstValidParticipant.toUpperCase()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHandle;
