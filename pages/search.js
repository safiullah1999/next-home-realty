import {useState} from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Flex, Box, Text, Icon } from "@chakra-ui/react";
import {BsFilter} from 'react-icons/bs';

import SearchFilters from "../components/SearchFilters";
import { fetchApi, baseUrl } from '../utils/fetchApi';
import { Property } from '../components/Property';
import noresult from '../assets/images/noresult.svg';

const Search = ({ properties }) => {
  const [searchFilters, setsearchFilters] = useState(false);
  const router= useRouter();

  return(
    <Box>
      <Flex
        cursor="pointer"
        bg="gray.100"
        borderBottom="1px"
        borderColor="gray.200"
        p="2"
        fontWeight="black"
        justifyContent="center"
        alignItems="center"
        onClick={()=> setsearchFilters((prevFilters) => !prevFilters)}
      >
        <Text>Search roperty By Filters</Text>
        <Icon paddingLeft="2" w="7" as={BsFilter} />
      </Flex>
      {searchFilters && <SearchFilters />}
      <Text fontSize={'2x1'} p={4} fontWeight={'bold'}>
        Properties {router.query.purpose}
      </Text>
      <Flex flexWrap={'wrap'}>
        {properties.map((property) => <Property property={property} key={property.id} /> )}
      </Flex>
      {properties.length === 0 &&(
        <Flex justifyContent={"center"} alignItems={"center"} flexDirection={"column"} marginTop={5} marginBottom={5} >
          <Image alt="No Result" src={noresult} />
          <Text fontSize={'2x1'} marginTop={3} >No Result Found</Text>
        </Flex>
      )}
    </Box>
  )
}

export default Search;

// in next js instead of using useEffect we use the below function.
export async function getServerSideProps({query}) {
  // we can do api calls
  // const propertyForSale = await fetchApi(`${baseUrl}/properties/list?locationExternalIDs=5002&purpose-for-sale&hitsPerPage=6`)
  // next js automatically adds these below props as props for our component 
  
  const purpose = query.purpose || 'for-sale' //'for-sale' is the default value here.
  const rentFrequency = query.rentFrequency || 'yearly'
  const minPrice = query.minPrice || '0';
  const maxPrice = query.maxPrice || '1000000';
  const roomsMin = query.roomsMin || '0';
  const bathsMin = query.bathsMin || '0';
  const sort = query.sort || 'price-desc';
  const areaMax = query.areaMax || '35000';
  const locationExternalIDs = query.locationExternalIDs || '5002';
  const categoryExternalID = query.categoryExternalID || '4';
  
  const data = await fetchApi(`${baseUrl}/properties/list?locationExternalIDs=${locationExternalIDs}&purpose=${purpose}&categoryExternalID=${categoryExternalID}&bathsMin=${bathsMin}&rentFrequency=${rentFrequency}&priceMin=${minPrice}&priceMax=${maxPrice}&roomsMin=${roomsMin}&sort=${sort}&areaMax=${areaMax}`);

  return {
    props: {
      properties: data?.hits,
    },
  };
}