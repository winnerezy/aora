"use client";

export const DashboardBar = () => {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
      <h2 className="text-4xl font-bold">My Files</h2>
      <button
        className="btn bg-primary text-white"
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