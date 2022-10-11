import {
    Flex,
    Heading,
    Text,
    Icon,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Tfoot,
    Box,
    TableContainer,
    TableCaption,
    Img,
    Button,
    HStack
} from "@chakra-ui/react"
import {
    SettingsIcon,
    DeleteIcon,
} from "@chakra-ui/icons"
import { Modal, Group } from '@mantine/core'
import { axiosInstance } from "../../../lib/hoc/api"
import * as moment from "moment"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/router"
import { useState } from "react"
import { useEffect } from "react"
import { useToast } from "@chakra-ui/react"
import AddCategoryForm from "../Forms/AddCategoryForm"
import EditCategoryForm from "../Forms/EditCategory"


export default function TableCategory (props) {
    
    const dispatch = useDispatch()
    const router = useRouter()
    const [opened, setOpened] = useState(false)
    const [opened2, setOpened2] = useState(false)
    const date = moment(new Date()).format("LLLL")
    const toast = useToast()
    const renderData = useSelector((state) => state.category)
    const [listCategory, setListCategory] = useState([])
    const [loadData, setLoadData] = useState(1)
    const {id, name, category_img} = props

    const fetchCategory = async () => {
        await axiosInstance.get("/category").then((res)=>{
            console.log(res)
            const data = res.data.results
            console.log("this is category " + data)
            setListCategory(res.data.results)
        }).catch((err) => {
            alert("error getting categories")
        })
    }

    useEffect(()=> {
        fetchCategory()
    }, [])

    useEffect(() => {
        if (renderData?.value !== undefined){
            setLoadData(loadData)
            fetchCategory()
            console.log(listCategory)
        }
    }, [renderData?.value]) 

    async function deleteCategory(id){
        try{
            await axiosInstance.delete("/category/" + id)
            
            toast ({
                title: "Deleted",
                description: "Category has been successfully deleted",
                status: "success",
                isClosable: true
            })
        } catch (err) {
            console.log(err)
            
            toast({
                title: "Error",
                description: "There was an error deleting category",
                status:"error",
                isClosable: true
            })
        }
    }

    const renderCategoryTable = () => {
        return listCategory.map((val, index) => {
            return (
                <Tr key={index}>
                    <Td>{val.id}</Td>
                    <Td>
                       <Img src={val?.category_img} w={"90px"} h={"50px"}/>
                    </Td>
                    <Td>
                        {val.name}
                    </Td>
                    <Td>
                        <EditCategoryForm 
                        key={index}
                        id_edit={val.id}
                        init_name={val.name}>
                        </EditCategoryForm>
                    </Td>
                    <Td>
                        <Button>
                            <DeleteIcon
                            key={index}
                            id={val?.id}
                            onClick={() => deleteCategory(val.id)}>
                            </DeleteIcon>
                        </Button>
                    </Td>
                </Tr>
            )
        })
    }

    return (
        <Flex
        h={[null, null, "300vh"]}
        maxW="2000px"
        flexDir={["column", "column", "row"]}
        overflow="hidden"
      >
        {/* Column 1 */}
  
        {/* --------------Column 2------------- */}
        <Flex
          w={["100%", "100%", "60%", "60%", "55%"]}
          p="2%"
          flexDir="column"
          overflow="auto"
          minH="full"
          minW="full"
        >

          <Box p={4}>
              <HStack spacing={5} align={"center"} justifyContent={"space-evenly"}>
              <Button bg={"gainsboro"} onClick={() => router.push("/Product/History")}>History</Button>
              <Button bg={"gainsboro"} onClick={() => router.push("/Product")}>Product</Button>
              </HStack>
          </Box>
  
          <Flex justifyContent="space-between" mt={8}>
            <Flex align="flex-end">
              <Heading as="h2" size="lg" letterSpacing="tight">
                CATEGORY
              </Heading>
              <Text fontSize="small" color="gray" ml={4}>
                {date}
              </Text>
             
            </Flex>
  
            
                <Modal opened={opened}
                onClose={()=> setOpened(false)}>
                    <AddCategoryForm />
                </Modal>
                <Group>
                    <Button bgColor="gray.200" 
                    onClick={()=> setOpened(true)}>
                        Add Category
                    </Button>
                </Group>
          </Flex>
          <Box
            mt={5}
            borderRadius={5}
            // bgColor={"#e3e3e3"}
            minH="40vh"
            minW="80vh"
            boxShadow={"dark-lg"}
            border={2}
          >
            {/* -----------TABLE CATEGORY---------- */}
            <TableContainer>
              <Table variant="striped">
                <TableCaption>List of Categories</TableCaption>
                <Thead>
                  <Tr>
                    <Th>Id</Th>
                    <Th>Image</Th>
                    <Th>Category</Th>
                    <Th>Edit</Th>
                    <Th>Delete</Th>
                  </Tr>
                </Thead>
                {/* ------------PRODUCT DATA--------- */}
                <Tbody>{renderCategoryTable()}</Tbody>
                <Tfoot>
                  {/* <Tr>
                    <Th>To convert</Th>
                    <Th>into</Th>
                    <Th>multiply by</Th>
                  </Tr> */}
                </Tfoot>
              </Table>
            </TableContainer>
          </Box>
        </Flex>
        {/* --------------Column 3------------ */}
      </Flex>
    )
}