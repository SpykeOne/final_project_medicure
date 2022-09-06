import { useState, useRef } from "react";
import { axiosInstance } from "../lib/api";
import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Lorem,
  Button,
  useDisclosure,
  useToast,
  Box,
  Flex,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Center,
} from "@chakra-ui/react";

import { useFormik } from "formik";
import jsCookie from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

const Uplaodimage = (props) => {
  const renderSelector = useSelector((state) => state.renderReducer);
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  const [selectedFiles, setSelctedFiles] = useState(null);
  const inputFileRef = useRef(null);
  const toast = useToast();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      image: "",
    },
    onSubmit: async () => {
      const formData = new FormData();
      formData.append("image", selectedFiles);

      try {
        const res = await axiosInstance.patch("/users/upload/3", formData);
        dispatch({
          type: "FETCH_DATA",
          payload: {
            value: !renderSelector.value,
          },
        });
        console.log(renderSelector);
        console.log(res);
        // console.log(res.response);
        if (res.status != 200) {
          throw new Error(res.message);
        }
        toast({
          title: "image uploaded",
          status: "success",
          isClosable: true,
        });
        // });

        props.onToggle();
      } catch (err) {
        console.log("dor");
        toast({
          title: `Error ${err}`,
          status: "error",
          isClosable: true,
        });
      }
    },
  });

  const handleFiles = (event) => {
    setSelctedFiles(event.target.files[0]);
  };
  return (
    <>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Input image</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Image</FormLabel>
            <Input
              type={"file"}
              display={"none"}
              onChange={handleFiles}
              accept={("image/png", "image/jpg", "image/jpeg")}
              ref={inputFileRef}
              colorScheme={"blue"}
            ></Input>
            <Button
              colorScheme={"blue"}
              onClick={() => {
                inputFileRef.current.click();
                console.log(inputFileRef);
              }}
            >
              Choose imagess
            </Button>
          </FormControl>
        </ModalBody>

        <ModalFooter gap={2}>
          <Button
            bg={"red.400"}
            color={"white"}
            _hover={{
              bg: "red.500",
            }}
            onClick={() => {
              props.onToggle();
            }}
          >
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => {
              formik.handleSubmit();
            }}
          >
            Upload
          </Button>
        </ModalFooter>
      </ModalContent>
    </>
  );
};

export default Uplaodimage;
