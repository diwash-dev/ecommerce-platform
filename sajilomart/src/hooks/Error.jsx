import React from "react";
import { useToast } from "./use-toast";
import { useDispatch } from "react-redux";
import { setUserLogout } from "@/Redux/ReduxSlice/authslice";

const Error = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const handleErrorLogout = (error, otherTitle = "error occured") => {
    if (error.response?.status === 401) {
      dispatch(setUserLogout());
      toast({
        title: "Session expired. Please log in again.",
        description:
          "Your session has expired. Please log in again to continue.",
        variant: "destructive",
      });
    } else {
      toast({
        title: otherTitle,
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return { handleErrorLogout };
};

export default Error;
