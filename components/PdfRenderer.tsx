"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollMode, Viewer } from "@react-pdf-viewer/core";
import {
  HorizontalScrollingIcon,
  scrollModePlugin,
  VerticalScrollingIcon,
  WrappedScrollingIcon,
} from "@react-pdf-viewer/scroll-mode";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { toolbarPlugin, ToolbarSlot } from "@react-pdf-viewer/toolbar";
import { useState } from "react";
import { useForm } from "react-hook-form";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useResizeDetector } from "react-resize-detector";
import { z } from "zod";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/page-navigation/lib/styles/index.css";
interface PdfRenderProps {
  url: string;
}

const PdfRenderer = ({ url }: PdfRenderProps) => {
  const toolbarPluginInstance = toolbarPlugin();
  const { Toolbar } = toolbarPluginInstance;

  const pageNavigationPluginInstance = pageNavigationPlugin();
  const {
    CurrentPageInput,
    GoToFirstPageButton,
    GoToLastPageButton,
    GoToNextPageButton,
    GoToPreviousPage,
  } = pageNavigationPluginInstance;

  const scrollModePluginInstance = scrollModePlugin();

  const { width, ref } = useResizeDetector();

  const pageValidator = z.object({
    page: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= numPages!),
  });

  const [numPages, setNumPages] = useState<number | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);

  type TpageValidator = z.infer<typeof pageValidator>;

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm<TpageValidator>({
    defaultValues: {
      page: String(currentPage),
    },
    resolver: zodResolver(pageValidator),
  });

  const handlePageSubmit = ({ page }: TpageValidator) => {
    setCurrentPage(Number(page));
    setValue("page", String(page));
  };

  return (
    <div
      className="rpv-core__viewer w-full mt-8"
      style={{
        border: "1px solid rgba(0, 0, 0, 0.3)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div
        className="text-black w-full shrink"
        style={{
          alignItems: "center",
          backgroundColor: "#eeeeee",
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
          display: "flex",
          padding: "4px",
        }}
      >
        <Toolbar>
          {(props: ToolbarSlot) => {
            const {
              CurrentPageInput,
              Download,
              EnterFullScreen,
              GoToNextPage,
              GoToPreviousPage,
              NumberOfPages,
              Print,
              ShowSearchPopover,
              Zoom,
              ZoomIn,
              ZoomOut,
            } = props;
            return (
             <div className="w-full flex items-center gap-2 sm:justify-evenly h-12">
                  <div className="flex items-center sm:gap-2">
                <ShowSearchPopover />
                  <ZoomOut />
                  <Zoom />
                  <ZoomIn />
                </div>
               <div className="flex items-center sm:gap-2">
                  <GoToPreviousPage />
              <GoToNextPage />
               <CurrentPageInput />
               / <NumberOfPages />
               </div>
               {/* <div className="flex items-center gap-2">
                  <EnterFullScreen />
                  <Download />
                  <Print />
              </div> */}
             </div>
            );
          }}
        </Toolbar>
      </div>

      <div
        style={{
          border: "1px solid rgba(0, 0, 0, 0.3)",
        }}
        className="h-screen flex flex-col w-full sm:50vh"
      >
        <Viewer
          fileUrl={url}
          scrollMode={ScrollMode.Page}
          plugins={[toolbarPluginInstance]}
        />
      </div>
    </div>
  );
};

export default PdfRenderer;
