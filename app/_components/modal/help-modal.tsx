"use client";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
      onClick={onClose} // Close modal when clicking outside the content
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-lg w-11/12 p-6 relative max-h-screen overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black text-lg font-bold"
          aria-label="Close Modal"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-3xl font-bold mb-4">How to Play</h2>

        {/* Instructions */}
        <p className="text-base text-gray-800 mb-4">
          Find groups of four items that share something in common.
        </p>
        <ul className="list-disc ml-6 text-base text-gray-800 mb-6">
          <li>
            Select four items and tap <span className="font-bold">&apos;Submit&apos;</span> to check if your guess is correct.
          </li>
          <li>Find the groups without making 4 mistakes!</li>
        </ul>

        {/* Category Examples */}
        <h3 className="text-lg font-bold mb-2">Category Examples</h3>
        <ul className="list-none ml-4 text-base text-gray-800 mb-6">
          <li>
            <span className="font-bold">FISH:</span> Bass, Flounder, Salmon, Trout
          </li>
          <li>
            <span className="font-bold">FIRE ___:</span> Ant, Drill, Island, Opal
          </li>
        </ul>
        <p className="text-base text-gray-800 mb-6">
          Categories will always be more specific than <span className="font-bold">&quot;5-LETTER-WORDS,&quot; &quot;NAMES&quot;</span> or <span className="font-bold">&quot;VERBS.&quot;</span>
        </p>

        {/* Additional Notes */}
        <p className="text-base text-gray-800 mb-6">
          Each puzzle has exactly one solution. Watch out for words that seem to belong to multiple categories!
        </p>
        <p className="text-base text-gray-800 mb-6">
          We have tried to incorporate at least one IIMA or Ahmedabad connection in each game!
        </p>
        <p className="text-base text-gray-800 mb-6">
          Each group is assigned a color, which will be revealed as you solve:
        </p>

        {/* Color Legend */}
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-yellow-300 rounded"></span>
            <span className="text-gray-800 text-base">Straightforward</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-green-400 rounded"></span>
            <span className="text-gray-800 text-base">Tricky</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-blue-300 rounded"></span>
            <span className="text-gray-800 text-base">Complex</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-purple-400 rounded"></span>
            <span className="text-gray-800 text-base">Very Tricky</span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="block bg-blue-500 hover:bg-blue-600 text-white text-base font-medium rounded py-2 px-4 mx-auto"
        >
          Close
        </button>
      </div>
    </div>
  );
}
