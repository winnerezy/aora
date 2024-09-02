"use client";

export const DashboardBar = () => {
  return (
    <div className="flex flex-row gap-6 items-center justify-between">
      <h2 className="text-2xl font-semibold">My PDF's</h2>
      <button
        className="btn bg-primary hover:bg-primary/90 text-white border-none"
        onClick={() =>{
          const modal =  document.getElementById("my_modal_2") as HTMLDialogElement
          if(modal) modal.showModal()
        }}
      >
        Upload PDF
      </button>
    </div>
  );
};