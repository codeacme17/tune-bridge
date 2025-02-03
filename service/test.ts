import { useToast } from "@/hooks/use-toast";

export const testDialog = (content: string) => {
  try {
    // const { toast } = useToast();

    // toast({
    //   title: content,
    //   description: "Friday, February 10, 2023 at 5:57 PM",
    // });

    console.log("content", content);
    alert(content);
    return "testDialog";
  } catch (error) {
    console.error(error);
  }
};
