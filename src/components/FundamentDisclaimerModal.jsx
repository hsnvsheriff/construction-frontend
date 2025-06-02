import React from 'react';

const FundamentDisclaimerModal = ({ onConfirm }) => {
  const [dontShowAgain, setDontShowAgain] = React.useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#1a1a1a] text-white rounded-2xl shadow-2xl px-8 py-6 w-full max-w-lg border border-neutral-800">
        <div className="mb-5">
          <h2 className="text-2xl font-semibold tracking-tight">Finalize the Fundament?</h2>
          <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
            This action will complete your floor outline. You won’t be able to undo it with <kbd>Cmd+Z</kbd>, 
            but you’ll still be able to edit walls, windows, and more.
          </p>
        </div>

        <label className="flex items-center text-sm text-neutral-500 mt-2 mb-6 cursor-pointer">
          <input
            type="checkbox"
            className="mr-2 accent-neutral-600 scale-110"
            checked={dontShowAgain}
            onChange={() => setDontShowAgain(!dontShowAgain)}
          />
          Don’t show this again
        </label>

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => onConfirm(false)}
            className="px-4 py-2 text-sm rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(dontShowAgain)}
            className="px-4 py-2 text-sm rounded-lg bg-white text-black font-semibold hover:bg-neutral-200 transition"
          >
            Complete Fundament
          </button>
        </div>
      </div>
    </div>
  );
};

export default FundamentDisclaimerModal;
