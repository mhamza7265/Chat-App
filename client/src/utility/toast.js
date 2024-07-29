import { createStandaloneToast } from "@chakra-ui/react";
const { toast } = createStandaloneToast();

export const successToast = (data) => {
  toast({
    title: data,
    position: "top",
    isClosable: false,
    variant: "top-accent",
    duration: 3000,
    status: "success",
  });
};

export const warningToast = (data) => {
  toast({
    title: data,
    position: "top",
    isClosable: false,
    duration: 3000,
    status: "warning",
  });
};

export const errorToast = (data) => {
  toast({
    title: data,
    position: "top",
    isClosable: false,
    duration: 3000,
    status: "error",
  });
};
