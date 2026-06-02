// import { create } from "zustand";
// import {
//     buildGlobalAssetRequests,
//     buildProjectAssets,
//     requestAssets,
//     type AssetRequest,
// } from "../components/asset-handling/assetRequests";
// import {
//     loadImage,
//     loadModel,
//     loadVideo,
//     type AssetRecord,
//     type ImageRecord,
// } from "../components/asset-handling/assetLoaders";

// // * ----------------------------------------------
// // * Asset Store: handles asset loading and storage
// // * ----------------------------------------------

// type AssetStoreState = {
//     // Project assets array by project ID
//     projectAssets: Record<string, AssetRecord[]>;

//     // Global assets by ID
//     globalAssets: Record<string, AssetRecord>;

//     // Initial global asset loading
//     isLoadingGlobal: boolean;
//     globalIsReady: boolean;
//     loaded: number;
//     total: number;

//     // Project loading
//     loadingProjects: Set<string>;
//     loadedProjects: Set<string>;

//     loadGlobalAssets: () => Promise<void>;
//     loadProjectAssets: (projectId: string) => Promise<void>;
// };

// const useAssetStore = create<AssetStoreState>((set, get) => ({
//     projectAssets: {},
//     globalAssets: {},

//     isLoadingGlobal: false,
//     globalIsReady: false,
//     loaded: 0,
//     total: 0,

//     loadingProjects: new Set<string>(),
//     loadedProjects: new Set<string>(),

//     loadGlobalAssets: async () => {
//         if (get().isLoadingGlobal || get().globalIsReady) return;

//         const incrementLoadedAmount = () => {
//             set((state) => ({
//                 loaded: state.loaded + 1,
//             }));
//         };

//         // Build global assets request objects
//         const requests = buildGlobalAssetRequests();
//         set({ isLoadingGlobal: true, loaded: 0, total: requests.length });

//         // Start loading the assets
//         const assets = await requestAssets(requests, incrementLoadedAmount);

//         set((state) => {
//             const globalAssets = { ...state.globalAssets };

//             assets.forEach((asset) => {
//                 globalAssets[asset.id] = asset;
//             });

//             return {
//                 globalAssets,
//                 isLoadingGlobal: false,
//                 globalIsReady: true,
//             };
//         });
//     },

//     loadProjectAssets: async (projectId: string) => {
//         const { loadedProjects, loadingProjects } = get();
//         if (loadedProjects.has(projectId) || loadingProjects.has(projectId))
//             return;

//         // Build asset request array
//         const requests = buildProjectAssets(projectId);

//         // Create a placeholder for each asset of the project
//         const placeholders: AssetRecord[] = requests.map((req) => ({
//             id: req.id,
//             type: req.type as AssetRecord["type"],
//             element: null,
//             texture: null,
//             isLoaded: false,
//         }));

//         // Add placeholder objects to project assets and set project as loading
//         set((state) => ({
//             projectAssets: {
//                 ...state.projectAssets,
//                 [projectId]: placeholders,
//             },
//             loadingProjects: new Set([...state.loadingProjects, projectId]),
//         }));

//         // * Loads
//         const loadOneAsset = async (request: AssetRequest, index: number) => {
//             try {
//                 // Load asset by type and await for resolve
//                 let asset: AssetRecord;
//                 if (request.type === "video") {
//                     asset = await loadVideo(request.src, request.id);
//                 } else if (request.type === "model") {
//                     asset = await loadModel(request.src, request.id);
//                 } else {
//                     asset = await loadImage(
//                         request.src,
//                         request.id,
//                         request.type as ImageRecord["type"],
//                     );
//                 }

//                 // Replace placeholder with loaded asset
//                 set((state) => {
//                     const currentArray = state.projectAssets[projectId];
//                     if (!currentArray) return state;

//                     const newArray = [...currentArray];
//                     newArray[index] = asset;

//                     return {
//                         projectAssets: {
//                             ...state.projectAssets,
//                             [projectId]: newArray,
//                         },
//                     };
//                 });
//             } catch (e) {
//                 console.warn(`Failed to load ${request.id}:`, e);
//             }
//         };

//         // Start loading all assets requested
//         const tasks = requests.map((request, index) =>
//             loadOneAsset(request, index),
//         );

//         // Await for every asset to be resolved
//         await Promise.all(tasks);

//         // Set project as loaded and remove from loading
//         set((state) => {
//             const newLoadingSet = new Set(state.loadingProjects);
//             newLoadingSet.delete(projectId);

//             const newLoadedSet = new Set(state.loadedProjects);
//             newLoadedSet.add(projectId);

//             return {
//                 loadingProjects: newLoadingSet,
//                 loadedProjects: newLoadedSet,
//             };
//         });
//     },
// }));

// export default useAssetStore;
