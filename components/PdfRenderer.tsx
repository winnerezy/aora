"use client";

import { File } from "@prisma/client";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import type {
  ToolbarSlot,
  TransformToolbarSlot,
} from "@react-pdf-viewer/toolbar";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const PdfRenderer = ({ file }: { file: File }) => {

  const toolbarPluginInstance = toolbarPlugin();
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const { renderDefaultToolbar, Toolbar } = toolbarPluginInstance;

  const transform: TransformToolbarSlot = (slot: ToolbarSlot) => ({
    ...slot,
    SwitchTheme: () => <></>,
    Open: () => <></>,
  });

  return (
    <div className="w-full h-[calc(100dvh-40px)]">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
        <div className="w-full h-[90dvh] flex-col text-white !important">
          <div className="align-center bg-[#eeeeee] flex p-1">
            <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
          </div>
          <Viewer
            fileUrl={file.url as string}
            plugins={[toolbarPluginInstance, pageNavigationPluginInstance]}
          />
        </div>
      </Worker>
    </div>
  );
};

export default PdfRenderer;
