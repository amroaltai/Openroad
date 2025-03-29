import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Trash,
  Edit,
  Save,
  X,
  Upload,
  Image,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageFields, setImageFields] = useState({
    image1: { useFile: false, preview: null },
    image2: { useFile: false, preview: null },
    image3: { useFile: false, preview: null },
  });
  const [editImageFields, setEditImageFields] = useState({
    image1: { useFile: false, preview: null },
    image2: { useFile: false, preview: null },
    image3: { useFile: false, preview: null },
  });
  const [redirecting, setRedirecting] = useState(false);

  const navigate = useNavigate();

  const fileInputRefs = {
    image1: useRef(null),
    image2: useRef(null),
    image3: useRef(null),
  };

  const editFileInputRefs = {
    image1: useRef(null),
    image2: useRef(null),
    image3: useRef(null),
  };

  const [newCar, setNewCar] = useState({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    image1: "",
    image2: "",
    image3: "",
    color: "",
    seats: 0,
    horsepower: 0,
    type: "Luxury",
  });

  const [editCar, setEditCar] = useState({
    brand: "",
    model: "",
    year: "",
    image1: "",
    image2: "",
    image3: "",
    color: "",
    seats: 0,
    horsepower: 0,
    type: "",
  });

  const API_BASE_URL =
    process.env.NODE_ENV === "production" ? "" : "http://localhost:5000";

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = sessionStorage.getItem("isAdminAuthenticated");
      if (authStatus === "true") {
        setIsAuthenticated(true);
      } else {
        setRedirecting(true);
        navigate("/");
      }
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCars();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    sessionStorage.removeItem("isAdminAuthenticated");
    setIsAuthenticated(false);
    navigate("/");
  };

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/cars`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setCars(data);
      setError(null);
    } catch (err) {
      setError(
        "Failed to load cars. Please check if the server is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  };

  const addCar = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setIsUploading(true);
      setUploadProgress(0);

      const formData = new FormData();

      formData.append("brand", newCar.brand);
      formData.append("model", newCar.model);
      formData.append("year", newCar.year);
      formData.append("color", newCar.color);
      formData.append("seats", newCar.seats);
      formData.append("horsepower", newCar.horsepower);
      formData.append("type", newCar.type);

      if (
        imageFields.image1.useFile &&
        fileInputRefs.image1.current?.files[0]
      ) {
        formData.append("image1", fileInputRefs.image1.current.files[0]);
      } else if (newCar.image1) {
        formData.append("image1_url", newCar.image1);
      }

      if (
        imageFields.image2.useFile &&
        fileInputRefs.image2.current?.files[0]
      ) {
        formData.append("image2", fileInputRefs.image2.current.files[0]);
      } else if (newCar.image2) {
        formData.append("image2_url", newCar.image2);
      }

      if (
        imageFields.image3.useFile &&
        fileInputRefs.image3.current?.files[0]
      ) {
        formData.append("image3", fileInputRefs.image3.current.files[0]);
      } else if (newCar.image3) {
        formData.append("image3_url", newCar.image3);
      }

      const response = await fetch(`${API_BASE_URL}/api/cars/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! Status: ${response.status} - ${
            errorData.error || "Unknown error"
          }`
        );
      }

      const data = await response.json();
      setNewCar({
        brand: "",
        model: "",
        year: new Date().getFullYear(),
        image1: "",
        image2: "",
        image3: "",
        color: "",
        seats: 0,
        horsepower: 0,
        type: "Luxury",
      });

      setImageFields({
        image1: { useFile: false, preview: null },
        image2: { useFile: false, preview: null },
        image3: { useFile: false, preview: null },
      });

      ["image1", "image2", "image3"].forEach((field) => {
        if (fileInputRefs[field].current) {
          fileInputRefs[field].current.value = "";
        }
      });

      fetchCars();
    } catch (err) {
      setError("Failed to add car: " + err.message);
    } finally {
      setLoading(false);
      setIsUploading(false);
    }
  };

  const deleteCar = async (id) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/cars/${id}`, {
        method: "DELETE",
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      fetchCars();
    } catch (err) {
      setError("Failed to delete car");
      setLoading(false);
    }
  };

  const startEditing = (car) => {
    setEditingId(car.id);
    setEditCar({
      brand: car.brand,
      model: car.model,
      year: car.year,
      image1: car.image1,
      image2: car.image2 || "",
      image3: car.image3 || "",
      color: car.color || "",
      seats: car.seats || 0,
      horsepower: car.horsepower || 0,
      type: car.type || "Luxury",
    });

    setEditImageFields({
      image1: { useFile: false, preview: car.image1 },
      image2: { useFile: false, preview: car.image2 },
      image3: { useFile: false, preview: car.image3 },
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditCar({
      brand: "",
      model: "",
      year: "",
      image1: "",
      image2: "",
      image3: "",
      color: "",
      seats: 0,
      horsepower: 0,
      type: "",
    });

    setEditImageFields({
      image1: { useFile: false, preview: null },
      image2: { useFile: false, preview: null },
      image3: { useFile: false, preview: null },
    });
  };

  const saveEdit = async (id) => {
    try {
      setLoading(true);
      setIsUploading(true);
      setUploadProgress(0);

      const hasImageChanges =
        editImageFields.image1.useFile ||
        editImageFields.image2.useFile ||
        editImageFields.image3.useFile;

      if (!hasImageChanges) {
        const propertyData = {
          brand: editCar.brand,
          model: editCar.model,
          year: parseInt(editCar.year),
          color: editCar.color || null,
          seats: parseInt(editCar.seats) || 0,
          horsepower: parseInt(editCar.horsepower) || 0,
          type: editCar.type || "Luxury",
        };

        const propertiesUrl = `${API_BASE_URL}/api/cars/${id}/properties`;
        const response = await fetch(propertiesUrl, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(propertyData),
        });

        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        const formData = new FormData();
        formData.append("brand", editCar.brand);
        formData.append("model", editCar.model);
        formData.append("year", editCar.year);
        formData.append("color", editCar.color);
        formData.append("seats", editCar.seats);
        formData.append("horsepower", editCar.horsepower);
        formData.append("type", editCar.type);

        if (
          editImageFields.image1.useFile &&
          editFileInputRefs.image1.current?.files[0]
        ) {
          formData.append("image1", editFileInputRefs.image1.current.files[0]);
        } else if (editCar.image1) {
          formData.append("image1_url", editCar.image1);
        }

        if (
          editImageFields.image2.useFile &&
          editFileInputRefs.image2.current?.files[0]
        ) {
          formData.append("image2", editFileInputRefs.image2.current.files[0]);
        } else if (editCar.image2) {
          formData.append("image2_url", editCar.image2);
        }

        if (
          editImageFields.image3.useFile &&
          editFileInputRefs.image3.current?.files[0]
        ) {
          formData.append("image3", editFileInputRefs.image3.current.files[0]);
        } else if (editCar.image3) {
          formData.append("image3_url", editCar.image3);
        }

        const response = await fetch(`${API_BASE_URL}/api/cars/${id}/upload`, {
          method: "PUT",
          body: formData,
        });

        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setEditingId(null);
      fetchCars();
    } catch (err) {
      setError("Failed to update car: " + err.message);
    } finally {
      setLoading(false);
      setIsUploading(false);
    }
  };

  const handleNewCarChange = (e) => {
    const { name, value } = e.target;
    setNewCar((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditCarChange = (e) => {
    const { name, value } = e.target;

    if (name === "seats" || name === "horsepower") {
      setEditCar((prev) => ({
        ...prev,
        [name]: value === "" ? 0 : parseInt(value, 10),
      }));
    } else {
      setEditCar((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileSelect = (field) => (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFields((prev) => ({
          ...prev,
          [field]: { useFile: true, preview: reader.result },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditFileSelect = (field) => (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImageFields((prev) => ({
          ...prev,
          [field]: { useFile: true, preview: reader.result },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleImageUploadType = (field) => {
    setImageFields((prev) => ({
      ...prev,
      [field]: { ...prev[field], useFile: !prev[field].useFile },
    }));

    if (!imageFields[field].useFile) {
      setNewCar((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const toggleEditImageUploadType = (field) => {
    setEditImageFields((prev) => ({
      ...prev,
      [field]: { ...prev[field], useFile: !prev[field].useFile },
    }));

    if (!editImageFields[field].useFile) {
      setEditCar((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const renderCarImage = (imageUrl) => {
    if (!imageUrl) return null;

    const fullImageUrl = imageUrl.startsWith("http")
      ? imageUrl
      : `${API_BASE_URL}${imageUrl}`;

    return (
      <div className="relative w-16 h-16 overflow-hidden rounded border border-gray-700">
        <img
          src={fullImageUrl}
          alt="Car"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "/images/placeholder.jpg";
          }}
        />
      </div>
    );
  };

  if (redirecting || !isAuthenticated) return null;

  if (loading && cars.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8">Car Admin Panel</h1>
          <div className="text-center py-10">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Car Admin Panel</h1>
          <button
            onClick={handleLogout}
            className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Plus size={20} className="mr-2" /> Add New Car
          </h2>

          <form onSubmit={addCar} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={newCar.brand}
                  onChange={handleNewCarChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Model</label>
                <input
                  type="text"
                  name="model"
                  value={newCar.model}
                  onChange={handleNewCarChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Year</label>
                <input
                  type="number"
                  name="year"
                  value={newCar.year}
                  onChange={handleNewCarChange}
                  required
                  min="1900"
                  max="2099"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Color</label>
                <input
                  type="text"
                  name="color"
                  value={newCar.color}
                  onChange={handleNewCarChange}
                  placeholder="Enter car color"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Seats</label>
                <input
                  type="number"
                  name="seats"
                  value={newCar.seats}
                  onChange={handleNewCarChange}
                  min="0"
                  max="10"
                  placeholder="Number of seats"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Horsepower
                </label>
                <input
                  type="number"
                  name="horsepower"
                  value={newCar.horsepower}
                  onChange={handleNewCarChange}
                  min="0"
                  placeholder="Horsepower"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  name="type"
                  value={newCar.type}
                  onChange={handleNewCarChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="SUV">SUV</option>
                  <option value="Sport">Sport</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Convertible">Convertible</option>
                  <option value="Economy">Economy</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium">
                    Image 1 (Required)
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleImageUploadType("image1")}
                    className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded-md"
                  >
                    {imageFields.image1.useFile
                      ? "Use URL Instead"
                      : "Upload File"}
                  </button>
                </div>

                {imageFields.image1.useFile ? (
                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRefs.image1}
                        onChange={handleFileSelect("image1")}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"
                      />
                      <Upload
                        size={16}
                        className="absolute right-3 top-3 text-gray-400"
                      />
                    </div>
                    {imageFields.image1.preview && (
                      <div className="relative w-full h-24 rounded-md overflow-hidden">
                        <img
                          src={imageFields.image1.preview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center">
                    <input
                      type="text"
                      name="image1"
                      value={newCar.image1}
                      onChange={handleNewCarChange}
                      required={!imageFields.image1.useFile}
                      placeholder="/images/car-1.jpg"
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium">
                    Image 2 (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleImageUploadType("image2")}
                    className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded-md"
                  >
                    {imageFields.image2.useFile
                      ? "Use URL Instead"
                      : "Upload File"}
                  </button>
                </div>

                {imageFields.image2.useFile ? (
                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRefs.image2}
                        onChange={handleFileSelect("image2")}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"
                      />
                      <Upload
                        size={16}
                        className="absolute right-3 top-3 text-gray-400"
                      />
                    </div>
                    {imageFields.image2.preview && (
                      <div className="relative w-full h-24 rounded-md overflow-hidden">
                        <img
                          src={imageFields.image2.preview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center">
                    <input
                      type="text"
                      name="image2"
                      value={newCar.image2}
                      onChange={handleNewCarChange}
                      placeholder="/images/car-2.jpg"
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium">
                    Image 3 (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleImageUploadType("image3")}
                    className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded-md"
                  >
                    {imageFields.image3.useFile
                      ? "Use URL Instead"
                      : "Upload File"}
                  </button>
                </div>

                {imageFields.image3.useFile ? (
                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRefs.image3}
                        onChange={handleFileSelect("image3")}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"
                      />
                      <Upload
                        size={16}
                        className="absolute right-3 top-3 text-gray-400"
                      />
                    </div>
                    {imageFields.image3.preview && (
                      <div className="relative w-full h-24 rounded-md overflow-hidden">
                        <img
                          src={imageFields.image3.preview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center">
                    <input
                      type="text"
                      name="image3"
                      value={newCar.image3}
                      onChange={handleNewCarChange}
                      placeholder="/images/car-3.jpg"
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                )}
              </div>
            </div>

            {isUploading && (
              <div className="mt-2">
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-orange-500 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Uploading: {uploadProgress}%
                </p>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-bold py-2 px-4 rounded-md transition-all duration-300 flex items-center"
                disabled={loading}
              >
                <Plus size={16} className="mr-2" />
                {loading ? "Adding..." : "Add Car"}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <h2 className="text-xl font-bold p-6">Manage Cars</h2>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full table-fixed md:table-auto">
              <thead className="bg-gray-700">
                <tr>
                  <th className="text-left p-2 md:p-4 w-12 md:w-auto">ID</th>
                  <th className="text-left p-2 md:p-4 w-24 md:w-auto">Brand</th>
                  <th className="text-left p-2 md:p-4 w-24 md:w-auto">Model</th>
                  <th className="text-left p-2 md:p-4 w-16 md:w-auto">Year</th>
                  <th className="text-left p-2 md:p-4 w-20 md:w-auto">
                    Images
                  </th>
                  <th className="text-left p-2 md:p-4 w-20 md:w-auto">Color</th>
                  <th className="text-left p-2 md:p-4 w-16 md:w-auto">Seats</th>
                  <th className="text-left p-2 md:p-4 w-16 md:w-auto">HP</th>
                  <th className="text-left p-2 md:p-4 w-24 md:w-auto">Type</th>
                  <th className="text-right p-2 md:p-4 w-24 md:w-auto">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {cars.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center p-4">
                      No cars found. Add your first car above.
                    </td>
                  </tr>
                ) : (
                  cars.map((car) => (
                    <tr key={car.id} className="hover:bg-gray-700/50">
                      {editingId === car.id ? (
                        <>
                          <td className="p-2 md:p-4 align-top">
                            <span className="block py-1">{car.id}</span>
                          </td>
                          <td className="p-2 md:p-4">
                            <input
                              type="text"
                              name="brand"
                              value={editCar.brand}
                              onChange={handleEditCarChange}
                              className="w-full bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-white text-sm min-w-[80px]"
                            />
                          </td>
                          <td className="p-2 md:p-4">
                            <input
                              type="text"
                              name="model"
                              value={editCar.model}
                              onChange={handleEditCarChange}
                              className="w-full bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-white text-sm min-w-[80px]"
                            />
                          </td>
                          <td className="p-2 md:p-4">
                            <input
                              type="number"
                              name="year"
                              value={editCar.year}
                              onChange={handleEditCarChange}
                              className="w-full bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-white text-sm min-w-[60px]"
                            />
                          </td>
                          <td className="p-2 md:p-4">
                            <div className="grid gap-2">
                              <div className="md:hidden">
                                <details className="bg-gray-800 rounded-md">
                                  <summary className="cursor-pointer p-2 rounded-md bg-gray-700 text-sm">
                                    Edit Images
                                  </summary>
                                  <div className="mt-2 p-2 space-y-2 bg-gray-800 rounded-md">
                                    <div className="flex items-center gap-1">
                                      <span className="text-xs">1:</span>
                                      <input
                                        type="text"
                                        name="image1"
                                        value={editCar.image1}
                                        onChange={handleEditCarChange}
                                        className="flex-1 bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-white text-xs"
                                      />
                                      <button
                                        type="button"
                                        onClick={() =>
                                          toggleEditImageUploadType("image1")
                                        }
                                        className="p-1 bg-gray-600 hover:bg-gray-500 rounded-md"
                                      >
                                        <Upload size={10} />
                                      </button>
                                    </div>

                                    <div className="flex items-center gap-1">
                                      <span className="text-xs">2:</span>
                                      <input
                                        type="text"
                                        name="image2"
                                        value={editCar.image2}
                                        onChange={handleEditCarChange}
                                        className="flex-1 bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-white text-xs"
                                      />
                                      <button
                                        type="button"
                                        onClick={() =>
                                          toggleEditImageUploadType("image2")
                                        }
                                        className="p-1 bg-gray-600 hover:bg-gray-500 rounded-md"
                                      >
                                        <Upload size={10} />
                                      </button>
                                    </div>

                                    <div className="flex items-center gap-1">
                                      <span className="text-xs">3:</span>
                                      <input
                                        type="text"
                                        name="image3"
                                        value={editCar.image3}
                                        onChange={handleEditCarChange}
                                        className="flex-1 bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-white text-xs"
                                      />
                                      <button
                                        type="button"
                                        onClick={() =>
                                          toggleEditImageUploadType("image3")
                                        }
                                        className="p-1 bg-gray-600 hover:bg-gray-500 rounded-md"
                                      >
                                        <Upload size={10} />
                                      </button>
                                    </div>
                                  </div>
                                </details>
                              </div>

                              <div className="hidden md:grid gap-2">
                                <div className="flex items-center">
                                  {editImageFields.image1.useFile ? (
                                    <div className="flex-grow relative">
                                      <input
                                        type="file"
                                        accept="image/*"
                                        ref={editFileInputRefs.image1}
                                        onChange={handleEditFileSelect(
                                          "image1"
                                        )}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-white text-xs"
                                      />
                                      {editImageFields.image1.preview && (
                                        <div className="absolute -right-8 top-0 w-7 h-7 rounded overflow-hidden">
                                          <img
                                            src={editImageFields.image1.preview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <input
                                      type="text"
                                      name="image1"
                                      value={editCar.image1}
                                      onChange={handleEditCarChange}
                                      placeholder="Image 1 URL"
                                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-white text-xs"
                                    />
                                  )}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      toggleEditImageUploadType("image1")
                                    }
                                    className="ml-1 p-1 bg-gray-600 hover:bg-gray-500 rounded-md"
                                  >
                                    {editImageFields.image1.useFile ? (
                                      <Edit size={12} />
                                    ) : (
                                      <Upload size={12} />
                                    )}
                                  </button>
                                </div>

                                <div className="flex items-center">
                                  {editImageFields.image2.useFile ? (
                                    <div className="flex-grow relative">
                                      <input
                                        type="file"
                                        accept="image/*"
                                        ref={editFileInputRefs.image2}
                                        onChange={handleEditFileSelect(
                                          "image2"
                                        )}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-white text-xs"
                                      />
                                      {editImageFields.image2.preview && (
                                        <div className="absolute -right-8 top-0 w-7 h-7 rounded overflow-hidden">
                                          <img
                                            src={editImageFields.image2.preview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <input
                                      type="text"
                                      name="image2"
                                      value={editCar.image2}
                                      onChange={handleEditCarChange}
                                      placeholder="Image 2 URL"
                                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-white text-xs"
                                    />
                                  )}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      toggleEditImageUploadType("image2")
                                    }
                                    className="ml-1 p-1 bg-gray-600 hover:bg-gray-500 rounded-md"
                                  >
                                    {editImageFields.image2.useFile ? (
                                      <Edit size={12} />
                                    ) : (
                                      <Upload size={12} />
                                    )}
                                  </button>
                                </div>

                                <div className="flex items-center">
                                  {editImageFields.image3.useFile ? (
                                    <div className="flex-grow relative">
                                      <input
                                        type="file"
                                        accept="image/*"
                                        ref={editFileInputRefs.image3}
                                        onChange={handleEditFileSelect(
                                          "image3"
                                        )}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-white text-xs"
                                      />
                                      {editImageFields.image3.preview && (
                                        <div className="absolute -right-8 top-0 w-7 h-7 rounded overflow-hidden">
                                          <img
                                            src={editImageFields.image3.preview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <input
                                      type="text"
                                      name="image3"
                                      value={editCar.image3}
                                      onChange={handleEditCarChange}
                                      placeholder="Image 3 URL"
                                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-white text-xs"
                                    />
                                  )}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      toggleEditImageUploadType("image3")
                                    }
                                    className="ml-1 p-1 bg-gray-600 hover:bg-gray-500 rounded-md"
                                  >
                                    {editImageFields.image3.useFile ? (
                                      <Edit size={12} />
                                    ) : (
                                      <Upload size={12} />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-2 md:p-4">
                            <input
                              type="text"
                              name="color"
                              value={editCar.color}
                              onChange={handleEditCarChange}
                              className="w-full bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-white text-sm min-w-[60px]"
                            />
                          </td>
                          <td className="p-2 md:p-4">
                            <input
                              type="number"
                              name="seats"
                              value={editCar.seats}
                              onChange={handleEditCarChange}
                              min="0"
                              max="10"
                              className="w-full bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-white text-sm min-w-[50px]"
                            />
                          </td>
                          <td className="p-2 md:p-4">
                            <input
                              type="number"
                              name="horsepower"
                              value={editCar.horsepower}
                              onChange={handleEditCarChange}
                              min="0"
                              className="w-full bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-white text-sm min-w-[60px]"
                            />
                          </td>
                          <td className="p-2 md:p-4">
                            <select
                              name="type"
                              value={editCar.type}
                              onChange={handleEditCarChange}
                              className="w-full bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-white text-sm min-w-[90px]"
                            >
                              <option value="SUV">SUV</option>
                              <option value="Sport">Sport</option>
                              <option value="Luxury">Luxury</option>
                              <option value="Convertible">Convertible</option>
                              <option value="Economy">Economy</option>
                            </select>
                          </td>
                          <td className="p-2 md:p-4 text-right">
                            <div className="flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-2">
                              <button
                                onClick={() => saveEdit(car.id)}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md flex items-center justify-center"
                              >
                                <Save size={16} className="mr-1" /> Save
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md flex items-center justify-center"
                              >
                                <X size={16} className="mr-1" /> Cancel
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-2 md:p-4 text-sm md:text-base">
                            {car.id}
                          </td>
                          <td className="p-2 md:p-4 text-sm md:text-base">
                            {car.brand}
                          </td>
                          <td className="p-2 md:p-4 text-sm md:text-base">
                            {car.model}
                          </td>
                          <td className="p-2 md:p-4 text-sm md:text-base">
                            {car.year}
                          </td>
                          <td className="p-2 md:p-4">
                            <div className="flex space-x-1 md:space-x-2">
                              {renderCarImage(car.image1)}
                              <div className="hidden md:block">
                                {renderCarImage(car.image2)}
                                {renderCarImage(car.image3)}
                              </div>
                            </div>
                          </td>
                          <td className="p-2 md:p-4 text-sm md:text-base">
                            {car.color || "N/A"}
                          </td>
                          <td className="p-2 md:p-4 text-sm md:text-base">
                            {car.seats || 0}
                          </td>
                          <td className="p-2 md:p-4 text-sm md:text-base">
                            {car.horsepower || 0}
                          </td>
                          <td className="p-2 md:p-4 text-sm md:text-base">
                            {car.type || "Luxury"}
                          </td>
                          <td className="p-2 md:p-4 text-right">
                            <div className="flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-2">
                              <button
                                onClick={() => startEditing(car)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md flex items-center justify-center"
                              >
                                <Edit size={16} className="mr-1" /> Edit
                              </button>
                              <button
                                onClick={() => deleteCar(car.id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md flex items-center justify-center"
                              >
                                <Trash size={16} className="mr-1" /> Delete
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
