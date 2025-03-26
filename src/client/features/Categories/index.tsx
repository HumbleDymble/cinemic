// import DeleteIcon from "@mui/icons-material/Delete";
// import {
//   Box,
//   IconButton,
//   List,
//   ListItem,
//   ListItemText,
//   TextField,
//   Typography,
// } from "@mui/material";
// import Grid from "@mui/material/Grid2";
// import { TreeItem } from "@mui/x-tree-view";
// import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
// import debounce from "lodash.debounce";
// import React from "react";
//
// interface Category {
//   id: number;
//   title: string;
//   expanded?: boolean | undefined;
//   subcategory?: {
//     id: number;
//     title: string;
//     expanded?: boolean | undefined;
//     subcategory?: {
//       id: number;
//       title: string;
//       body: string;
//     }[];
//   }[];
// }
//
// interface CategoryProps {
//   data?: Category[];
// }
//
// const categoryArray: Category[] = [
//   {
//     id: 1,
//     title: "Electronics",
//     expanded: true,
//     subcategory: [
//       {
//         id: 11,
//         title: "Mobile phones",
//         expanded: true,
//         subcategory: [
//           {
//             id: 111,
//             title: "Apple",
//             body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
//           },
//           {
//             id: 112,
//             title: "Samsung",
//             body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
//           },
//           {
//             id: 113,
//             title: "Realme",
//             body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: 2,
//     title: "Computer Components",
//     expanded: true,
//     subcategory: [
//       {
//         id: 22,
//         title: "Nvidia",
//         expanded: true,
//         subcategory: [
//           {
//             id: 222,
//             title: "RTX 4070",
//             body: "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla",
//           },
//           {
//             id: 223,
//             title: "RTX 4080",
//             body: "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla",
//           },
//           {
//             id: 224,
//             title: "RTX 4090",
//             body: "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: 3,
//     title: "Категория C",
//   },
//   {
//     id: 4,
//     title: "Категория D",
//   },
//   {
//     id: 5,
//     title: "Категория E",
//   },
// ];
//
// interface recentSearchedProps {
//   recentSearchedTitle: string[];
// }
//
// const CategoriesExpanded = ({ data }: CategoryProps) => {
//   return (
//     <>
//       {data?.map((subcategory: Category) => {
//         return (
//           <TreeItem
//             key={subcategory.id}
//             itemId={subcategory.title}
//             label={subcategory.title}
//           >
//             {Array.isArray(subcategory.subcategory || subcategory) && (
//               <CategoriesExpanded data={subcategory.subcategory} />
//             )}
//           </TreeItem>
//         );
//       })}
//     </>
//   );
// };
//
// const Category = () => {
//   const [search, setSearch] = React.useState("");
//   const [expandedItems, setExpandedItems] = React.useState<string[]>([]);
//   const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
//   const [recentSearched, setRecentSearched] = React.useState<
//     recentSearchedProps[]
//   >([]);
//   const [focusItems, setFocusItems] = React.useState<string>("");
//
//   const filterByTitle = (
//     array: Category[],
//     search: string,
//     path: string[] = [],
//   ) => {
//     const items: string[] = [];
//
//     array.forEach((item: Category) => {
//       const currentPath: string[] = [...path, item.title];
//       const filter = item.title.toLowerCase().includes(search.toLowerCase());
//
//       if (search && filter) {
//         items.push(...currentPath);
//         setExpandedItems(items);
//         setSelectedItems(items);
//         setRecentSearched((old) => [...old, { recentSearchedTitle: items }]);
//         setFocusItems(item.title);
//       } else if (item.subcategory) {
//         filterByTitle(item.subcategory, search, currentPath);
//       }
//     });
//   };
//
//   const handleExpansionChange = (
//     event: React.SyntheticEvent,
//     itemId: string[],
//   ) => {
//     setExpandedItems(itemId);
//   };
//
//   const handleSelectionChange = (
//     event: React.SyntheticEvent,
//     itemId: string[],
//   ) => {
//     setSelectedItems(itemId);
//   };
//
//   const handleFocusChange = (
//     event: React.SyntheticEvent | null,
//     itemId: string,
//   ) => {
//     setFocusItems(itemId);
//   };
//
//   const handleRecentSearchedTitle = (title: recentSearchedProps) => {
//     setRecentSearched(recentSearched.filter((item) => item.recentSearchedTitle !== title.recentSearchedTitle));
//   }
//
//   const bounce = React.useCallback(debounce(filterByTitle, 400), []);
//
//   React.useEffect(() => {
//     if (!search) {
//       setExpandedItems([]);
//     }
//     search.trim() && bounce(categoryArray, search);
//   }, [search]);
//
//   return (
//     <Box boxShadow="1">
//       <TextField
//         label="Поиск"
//         fullWidth
//         id="outlined-size-small"
//         defaultValue=""
//         size="small"
//         onChange={(e) => setSearch(e.target.value)}
//       />
//       <SimpleTreeView
//         multiSelect
//         expandedItems={expandedItems}
//         onExpandedItemsChange={handleExpansionChange}
//         selectedItems={selectedItems}
//         onSelectedItemsChange={handleSelectionChange}
//         onItemFocus={handleFocusChange}
//       >
//         {categoryArray.map((category, key) => {
//           const isExpanded = category.expanded === true;
//           return (
//             <>
//               {isExpanded ? (
//                 <TreeItem
//                   key={key}
//                   itemId={category.title}
//                   label={category.title}
//                 >
//                   <CategoriesExpanded data={category.subcategory} />
//                 </TreeItem>
//               ) : (
//                 <TreeItem
//                   key={key}
//                   itemId={category.title}
//                   label={category.title}
//                 />
//               )}
//             </>
//           );
//         })}
//       </SimpleTreeView>
//       <Grid size={4}>
//         <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
//           Recent searched
//         </Typography>
//         {recentSearched.map((item) => {
//           return (
//             <List>
//               <ListItem
//                 secondaryAction={
//                   <div onClick={()=> handleRecentSearchedTitle(item)}>
//                   <IconButton edge="end" aria-label="delete">
//                     <DeleteIcon  />
//                   </IconButton>
//                   </div>
//                 }
//               >
//                 <ListItemText primary={item.recentSearchedTitle} />
//               </ListItem>
//             </List>
//           );
//         })}
//       </Grid>
//     </Box>
//   );
// };
//
// export default Category;
