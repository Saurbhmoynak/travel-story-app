import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { data, useNavigate } from "react-router-dom";
import apiRequest from "../../utils/apiRequest";
import TravelStoryCard from "../../components/Cards/TravelStoryCard";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import AddEditTravelStory from "./AddEditTravelStory";
import ViewTravelStory from "./ViewTravelStory";

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);
  const [openAddEditModel, setOpenAddEditModel] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  });

  const getUserInfo = async () => {
    try {
      const response = await apiRequest.get("/get-user");
      if (response.data && response.data.user) {
        //set user info if data exists
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status == 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getAllTravelStories = async () => {
    try {
      const response = await apiRequest.get("/get-all-stories");
      if (response.data && response.data.stories) {
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please tyr again.");
    }
  };

  const handleEdit = async (data) => {};

  const handleViewStory = async (data) => {
    setOpenViewModal({ isShown: true, data });
  };

  const updateIsFavourite = async (storyData) => {
    // Extract story ID from the story data
    const storyId = storyData._id;

    try {
      // Send a PUT request to update the "isFavourite" status of the story
      const response = await apiRequest.put("/update-is-favourite/" + storyId, {
        //If storyData.isFavourite is true, it will be set to false (and vice versa).
        isFavourite: !storyData.isFavourite, // Toggle the isFavourite value
      });

      // If the response contains updated story data, refresh the stories list
      if (response.data && response.data.story) {
        toast.success("Story updated successfully");
        getAllTravelStories(); // Fetch updated travel stories after update
      }
    } catch (error) {
      // Log a generic error message in case of failure
      console.log("An unexpected error occurred. Please try again");
    }
  };

  useEffect(() => {
    getAllTravelStories();
    getUserInfo();
    return () => {};
  }, []);

  //Get user info
  return (
    <>
      <Navbar userInfo={userInfo} />
      <div className="container mx-auto py-10">
        <div className="flex gap-7">
          <div className="flex-1">
            {allStories.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {allStories.map((item) => (
                  <TravelStoryCard
                    key={item._id}
                    imgUrl={item.imageUrl}
                    title={item.title}
                    story={item.story}
                    date={item.visitedDate}
                    visitedLocation={item.visitedLocation}
                    isFavourite={item.isFavourite}
                    onEdit={() => handleEdit(item)}
                    onClick={() => handleViewStory(item)}
                    onFavouriteClick={() => updateIsFavourite(item)}
                  />
                ))}
              </div>
            ) : (
              <>Empty Card Here</>
            )}
          </div>
          <div className="w-[320px]"></div>
        </div>
      </div>

      {/* Add and edit travel stories modal*/}
      <Modal
        isOpen={openAddEditModel.isShown} // Controls whether the modal is open or closed
        onRequestClose={() => {}} // Empty function (could be updated to close the modal)
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)", // Semi-transparent black background overlay
            zIndex: 999, // Ensures the modal appears above other elements
          },
        }}
        appElement={document.getElementById("root")} // Specifies the root element for accessibility
        className="model-box scrollbar" // Custom class for styling the modal
      >
        {/* Component for adding or editing a travel story */}
        <AddEditTravelStory
          type={openAddEditModel.type} // Defines if the action is "add" or "edit"
          storyInfo={openAddEditModel.data} // Passes the current story data if editing
          onClose={() => {
            setOpenAddEditModel({ isShown: false, type: "add", data: null }); // Closes the modal and resets state
          }}
          getAllTravelStories={getAllTravelStories} // Function to refresh the travel stories list after changes
        />
      </Modal>

      {/* View travel stories modal*/}
      <Modal
        isOpen={openViewModal.isShown} // Controls whether the modal is open or closed
        onRequestClose={() => {}} // Empty function (could be updated to close the modal)
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)", // Semi-transparent black background overlay
            zIndex: 999, // Ensures the modal appears above other elements
          },
        }}
        appElement={document.getElementById("root")} // Specifies the root element for accessibility
        className="model-box scrollbar" // Custom class for styling the modal
      >
        {/* Component for adding or editing a travel story */}
        <ViewTravelStory
          storyInfo={openViewModal.data || null}
          onClose={() => {}}
          onEditClick={() => {}}
          OnDeleteClick={() => {}}
        />
      </Modal>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-cyan-400 hover:bg-emerald-400 fixed right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModel({
            isShown: true,
            type: "add",
            data: null,
          });
        }}
      >
        <MdAdd className="text-[32px] text-white hover:text-[40px]" />
      </button>

      <ToastContainer />
    </>
  );
};

export default Home;
