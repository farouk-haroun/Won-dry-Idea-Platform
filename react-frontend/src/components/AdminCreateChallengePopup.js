import React, { useState } from 'react';
import { X, Upload, Plus } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const AdminCreateChallengePopup = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    stages: [{ name: 'Opening Round', until: '2024/09/29' }],
    organizers: [],
    description: '',
    thumbnail: null,
    category: 'in Social Innovation'
  });

  const categories = [
    'SUSTAINABILITY',
    'SOCIAL INNOVATION',
    'TECHNOLOGY',
    'HEALTHCARE',
    'EDUCATION'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStageRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      stages: prev.stages.filter((_, i) => i !== index)
    }));
  };

  const handleStageAdd = () => {
    setFormData(prev => ({
      ...prev,
      stages: [...prev.stages, { name: '', until: '' }]
    }));
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        thumbnail: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'stages' || key === 'organizers') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === 'thumbnail' && formData[key]) {
          formDataToSend.append('thumbnail', formData[key]);  // Append the thumbnail file
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
  
      const response = await axios.post(`${API_BASE_URL}/challenges`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      if (response.status === 201) {
        onClose();  // Close popup if creation is successful
      }
    } catch (error) {
      console.error('Error creating challenge:', error);
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-5xl w-full mx-4 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-semibold text-center text-purple-600 mb-8">Add Challenge</h2>

        <div className="flex gap-8">
          {/* Form Section */}
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2">Title:</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Required"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Category:</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Stages:</label>
                <div className="space-y-4">
                  {formData.stages.map((stage, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <input
                        type="text"
                        value={stage.name}
                        onChange={(e) => {
                          const newStages = [...formData.stages];
                          newStages[index].name = e.target.value;
                          setFormData(prev => ({ ...prev, stages: newStages }));
                        }}
                        className="flex-1 p-3 border rounded-lg"
                        placeholder="Stage name"
                      />
                      <input
                        type="date"
                        value={stage.until}
                        onChange={(e) => {
                          const newStages = [...formData.stages];
                          newStages[index].until = e.target.value;
                          setFormData(prev => ({ ...prev, stages: newStages }));
                        }}
                        className="w-40 p-3 border rounded-lg"
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => handleStageRemove(index)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-6 w-6" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleStageAdd}
                    className="flex items-center text-purple-600 hover:text-purple-700"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Stage
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Description:</label>
                <textarea
                  name="description"
                  required
                  placeholder="Required"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Upload Challenge
              </button>
            </form>
          </div>

          {/* Preview Section */}
          <div className="w-80">
            <h3 className="text-gray-700 font-medium mb-4">Preview</h3>
            <div className="sticky top-8">
              {/* <PreviewCard /> */}
              <div className="mt-4">
                <label className="block text-gray-700 mb-2">Thumbnail:</label>
                <div className="border-2 border-dashed rounded-lg p-4">
                  <input
                    type="file"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                    id="thumbnail-upload"
                    accept="image/*"
                  />
                  <label
                    htmlFor="thumbnail-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-gray-600">Upload Thumbnail</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateChallengePopup;