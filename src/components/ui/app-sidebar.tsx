// import {
//   getSystemNodes,
//   NodeCategory,
//   SystemNode,
// } from '@/backend/getSystemNodes';
// import { useEffect, useState } from 'react';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
// import { DrawerContent, DrawerHeader, DrawerTitle } from './drawer';
// import { SystemToolItem } from './system-tool-item';

// type SidebarProps = {
//   onAddNode: (nodeData: SystemNode) => void;
//   showOnly: string[];
// };

// const nodesClassification: NodeCategory[] = [
//   'initiate',
//   'conditional',
//   'action',
//   'generate',
//   'close',
// ];

// export const AppSidebar: React.FC<SidebarProps> = ({ onAddNode, showOnly }) => {
//   const [systemNodes, setSystemNodes] = useState<SystemNode[]>();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setLoading(true);
//     getSystemNodes()
//       .then(nodes => {
//         setSystemNodes(nodes);
//       })
//       .catch(error => {
//         console.error('Failed to fetch system nodes:', error);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, []);

//   return (
//     <>
//       <DrawerContent className="bg-zinc-800 border-zinc-800">
//         <div className="mx-auto w-[80%] dark">
//           <DrawerHeader>
//             <DrawerTitle>Start your journey</DrawerTitle>
//           </DrawerHeader>

//           <Tabs
//             defaultValue={showOnly[0]}
//             style={{
//               display: 'flex',
//               flexDirection: 'row',
//             }}>
//             <div className="flex ">
//               <TabsList className="h-[100%] bg-zinc-600 flex flex-col m-3 gap-3">
//                 <TabsTrigger
//                   disabled={!showOnly.includes('initiate')}
//                   value="initiate">
//                   Initiate
//                 </TabsTrigger>
//                 <TabsTrigger
//                   disabled={!showOnly.includes('conditional')}
//                   value="conditional">
//                   Conditions
//                 </TabsTrigger>
//                 <TabsTrigger
//                   disabled={!showOnly.includes('action')}
//                   value="action">
//                   Action
//                 </TabsTrigger>
//                 <TabsTrigger
//                   disabled={!showOnly.includes('generate')}
//                   value="generate">
//                   Generate
//                 </TabsTrigger>
//                 <TabsTrigger
//                   disabled={!showOnly.includes('close')}
//                   value="close">
//                   Close
//                 </TabsTrigger>
//               </TabsList>

//               {nodesClassification.map(category => {
//                 return (
//                   <TabsContent
//                     key={category}
//                     value={category}
//                     className="flex flex-row flex-wrap">
//                     {systemNodes
//                       ?.filter(n => n.category === category)
//                       .map(node => {
//                         return (
//                           <SystemToolItem
//                             onAddNode={onAddNode}
//                             node={node}
//                             key={node._id}
//                           />
//                         );
//                       })}
//                   </TabsContent>
//                 );
//               })}
//             </div>
//           </Tabs>
//           <div className="h-[100px]"></div>
//         </div>
//       </DrawerContent>
//     </>
//   );
// };

import {
  getSystemNodes,
  NodeCategory,
  SystemNode,
} from '@/backend/getSystemNodes';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { DrawerContent, DrawerHeader, DrawerTitle } from './drawer';
import { SystemToolItem } from './system-tool-item';

type SidebarProps = {
  onAddNode: (nodeData: SystemNode) => void;
  showOnly: string[];
};

const nodesClassification: NodeCategory[] = [
  'initiate',
  'conditional',
  'action',
  'generate',
  'close',
];

export const AppSidebar: React.FC<SidebarProps> = ({ onAddNode, showOnly }) => {
  const [systemNodes, setSystemNodes] = useState<SystemNode[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getSystemNodes()
      .then(nodes => setSystemNodes(nodes))
      .catch(error => console.error('Failed to fetch system nodes:', error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DrawerContent className="bg-gray-900 border-l border-gray-800 text-white">
      <div className="w-full px-4 pt-4">
        <DrawerHeader>
          <DrawerTitle className="text-lg font-semibold text-gray-100">
            🚀 Start your journey
          </DrawerTitle>
        </DrawerHeader>

        <Tabs defaultValue={showOnly[0]} className="flex gap-4 mt-4">
          {/* Vertical Tabs */}
          <TabsList className="flex flex-col gap-2 w-36 p-2 bg-gray-800 rounded-md">
            {nodesClassification.map(category => (
              <TabsTrigger
                key={category}
                value={category}
                disabled={!showOnly.includes(category)}
                className="capitalize px-3 py-2 text-left text-sm rounded-md hover:bg-gray-700 aria-selected:bg-gray-700 aria-selected:text-white text-gray-300">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab Panels */}
          <div className="flex-1 h-[65vh] overflow-y-auto px-1">
            {nodesClassification.map(category => (
              <TabsContent key={category} value={category}>
                {loading ? (
                  <div className="text-gray-400 text-sm py-4">
                    Loading tools...
                  </div>
                ) : (
                  <div className="space-y-3">
                    {systemNodes
                      ?.filter(n => n.category === category)
                      .map(node => (
                        <SystemToolItem
                          key={node._id}
                          node={node}
                          onAddNode={onAddNode}
                        />
                      )) || (
                      <div className="text-gray-500 italic">
                        No tools available.
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </DrawerContent>
  );
};
