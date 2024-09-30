import Chat from "@/components/Chat"
import PdfRenderer from "@/components/PdfRenderer"
import { prisma } from "@/lib/utils/prisma"

const page = async ({ params: { fileId } }: {  params: { fileId: string }}) => {

  const file = await prisma.file.findFirst({
    where: {
      id: fileId
    }
  })
  return (
    <div className="flex flex-col md:flex-row gap-y-4">

     {
      file &&  <PdfRenderer file={file!}/>
     }
     <Chat fileId={fileId} fileUrl={file?.url!}/>
        
    </div>
  )
}

export default page