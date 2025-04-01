import React, { useState } from "react";
import { MdClose, MdDeleteOutline, MdUpdate, MdAdd } from "react-icons/md";
import DateSelector from "../../components/Input/DateSelector";
import ImageSelector from "../../components/Input/ImageSelector";
import TagInput from "../../components/Input/TagInput";
import apiRequest from "../../utils/apiRequest";
import moment from "moment";
import uploadImage from "../../utils/uploadImage";
import { toast } from "react-toastify";

const AddEditTravelStory = ({
  storyInfo,
  type,
  onClose,
  getAllTravelStories,
}) => {
  const [title, setTitle] = useState(storyInfo?.title||"");
  const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl||null);
  const [story, setStory] = useState(storyInfo?.story||"");
  const [visitedLocation, setVisitedLocation] = useState(storyInfo?.visitedLocation||[]);
  const [visitedDate, setVisitedDate] = useState(storyInfo?.visitedDate||null);
  const [error, setError] = useState(null);

  //add new story
  const addNewTravelStory = async () => {
    try {
      let imageUrl = "";

      //upload image if present
      if (storyImg) {
        const imgUploadRes = await uploadImage(storyImg);
        //get image URL
        imageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await apiRequest.post("/add-travel-story", {
        title,
        story,
        imageUrl: imageUrl || "",
        visitedLocation,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Story Added Successfully");
        //Refresh stories
        getAllTravelStories();
        //close model or form
        onClose();
      } else {
        toast.error("Failed to add story.");
      }
    } catch (error) {
      console.error("Error adding story:",
        error.response?.data || error.message
      );
      toast.error("Something went wrong!");
    }
  };

  //update travel story
  const updateTravelStory = async () => {
    const storyId = storyInfo._id;
    try {
      let imageUrl = "";

      let postData = {
        title,
        story,
        imageUrl: storyInfo.imageUrl || "",
        visitedLocation,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      }

      //upload image if present

      if (typeof storyImg === 'object') {
        //upload new image
        const imgUploadRes = await uploadImage(storyImg);
        imageUrl = imgUploadRes.imageUrl || "";

        postData = {
          ...postData,
          imageUrl: imageUrl,
        };
      }

      const response = await apiRequest.put("/edit-story/"+storyId, postData);

      if (response.status === 200 || response.status === 201) {
        toast.success("Story Updated Successfully");
        //Refresh stories
        getAllTravelStories();
        //close model or form
        onClose();
      }
    } catch (error) {
      console.error("Error updating story:",
        error.response?.data || error.message
      );
      toast.error("Something went wrong!");
    }
  };

  const handleAddOrUpdateClick = () => {
    console.log({ title, story, visitedLocation, visitedDate });

    if (!title) {
      setError("Please enter the title");
      return;
    }

    if (!story) {
      setError("Please enter the story");
      return;
    }

    if (!storyImg) {
      setError("No image file selected.");
      return;
    }

    setError("");

    if (type === "edit") {
      updateTravelStory();
    } else {
      addNewTravelStory();
    }
  };

  const handleDeleteStoryImg = async () => {
    //Deleting the image
    const deleteImgRes = await apiRequest.delete("/delete-image", {
      params: {
        imageUrl: storyInfo.imageUrl,
      },
    });

    if (deleteImgRes.data) {
      const storyId = storyInfo._id;
      const postData = {
        title,
        story,
        visitedLocation,
        visitedDate: moment().valueOf(),
        imageUrl:"",
      }

      //updating story
      const response = await apiRequest.put("/edit-story/" + storyId, postData);

      setStoryImg(null);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <h5 className="text-xl font-medium text-slate-700">
          {type === "add" ? "Add Story" : "Update Story"}
        </h5>

        <div>
          <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
            {type === "add" ? (
              <button className="btn-small" onClick={handleAddOrUpdateClick}>
                <MdAdd className="text-lg" /> ADD STORY
              </button>
            ) : (
              <button className="btn-small" onClick={handleAddOrUpdateClick}>
                <MdUpdate className="text-lg" /> UPDATE STORY
              </button>
            )}

            <button className="" onClick={onClose}>
              <MdClose className="text-xl text-slate-400" />
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-xs pt-2 text-right mr-9">{error}</p>
          )}
        </div>
      </div>

      <div>
        <div className="flex-1 flex flex-col gap-2 pt-4">
          <label className="input-label">TITLE</label>
          <input
            type="text"
            className="text-2xl text-slate-950 outline-none"
            placeholder="A Day at the Great Wall"
            value={title}
            onChange={({ target }) => {
              setTitle(target.value);
            }}
          />

          <div className="my-3">
            <DateSelector date={visitedDate} setDate={setVisitedDate} />
          </div>

          <ImageSelector
            image={storyImg}
            setImage={setStoryImg}
            handleDeleteImg={handleDeleteStoryImg}
          />

          <div className="flex flex-col gap-2 mt-4">
            <label className="input-label">STORY</label>
            <textarea
              className="text-sm text-slate-950 outline-none bg-slate-100 p-2 rounded"
              placeholder="Your Story"
              rows={10}
              value={story}
              type="text"
              onChange={({ target }) => {
                setStory(target.value);
              }}
            />

            <div className="pt-3">
              <label className="input-label">VISITED LOCATIONS</label>
              <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditTravelStory;
