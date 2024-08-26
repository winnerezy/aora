"use client";

import { Document, Page } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import cn from "classnames";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Worker } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

interface PdfRenderProps {
  url: string;
}

const PdfRenderer = ({ url }: PdfRenderProps) => {
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
    <div className="w-full h-screen bg-gray-600 rounded-md shadow flex flex-col items-center">
      <div className="h-14 p-2 w-full border-zinc-600 flex items-start justify-between border-b">
        <div className="flex items-center gap-2">
          <button
            aria-label="previous page"
            className="btn w-20"
            onClick={() => {
              setCurrentPage((prev) => (prev - 1 > 1 ? prev - 1 : 1));
            }}
          >
            <BiChevronDown />
          </button>
          <div className="flex items-center gap-1.5">
            <input
              {...register("page")}
              value={currentPage}
              className={cn(
                "items-center p-2 input w-12 h-8 bg-white text-black",
                errors.page && "border border-red-500"
              )}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(handlePageSubmit)();
                }
              }}
            />
            <p className="text-zinc-200 text-sm spac-x-1">
              <span>/</span>
              <span>{numPages ?? "x"}</span>
            </p>
          </div>
          <button
            disabled={numPages === undefined || currentPage === numPages}
            aria-label="next page"
            className="btn w-20"
            onClick={() => {
              setCurrentPage((prev) =>
                prev + 1 > numPages! ? numPages! : prev + 1
              );
            }}
          >
            <BiChevronUp />
          </button>
        </div>
      </div>
      <div className="flex-1 w-full overflow-y-auto" ref={ref}>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <Viewer fileUrl={url} />;
        </Worker>
        {/* <Document
          loading={
            <div className="flex justify-center">
              <span className="my-24 loading loading-lg loading-spinner max-h-full" />
            </div>
          }
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages)
          }}
          file={url} className="max-h-full">
          <Page width={width ? width : 1} scale={1} pageNumber={currentPage} />
        </Document> */}
      </div>
    </div>
  );
};

export default PdfRenderer;
