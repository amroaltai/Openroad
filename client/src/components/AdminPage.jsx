import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash, Edit, Save, X, Upload, LogOut } from "lucide-react";
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
  // Add state for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);

  const navigate = useNavigate();
  const API_BASE_URL =
    process.env.NODE_ENV === "production" ? "" : "http://localhost:5000";
  const CAR_TYPES = ["SUV", "Sport", "Luxury", "Convertible", "Economy"];

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
    price_per_day: 0,
    price_per_week: 0,
    price_per_month: 0,
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
    price_per_day: 0,
    price_per_week: 0,
    price_per_month: 0,
  });

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
    if (isAuthenticated) fetchCars();
  }, [isAuthenticated]);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/cars`);
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      setCars(await response.json());
      setError(null);
    } catch (err) {
      setError("Failed to load cars. Please check server connection.");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIdFromType = (type) => {
    switch (type) {
      case "Economy":
        return 1;
      case "Sport":
        return 2;
      case "SUV":
        return 3;
      case "Convertible":
        return 4;
      default:
        return 5;
    }
  };

  const handleNewCarChange = (e) => {
    const { name, value } = e.target;
    setNewCar((prev) => ({
      ...prev,
      [name]: [
        "seats",
        "horsepower",
        "price_per_day",
        "price_per_week",
        "price_per_month",
      ].includes(name)
        ? value === ""
          ? 0
          : parseFloat(value)
        : value,
    }));
  };

  const handleEditCarChange = (e) => {
    const { name, value } = e.target;
    setEditCar((prev) => ({
      ...prev,
      [name]: [
        "seats",
        "horsepower",
        "price_per_day",
        "price_per_week",
        "price_per_month",
      ].includes(name)
        ? value === ""
          ? 0
          : parseFloat(value)
        : value,
    }));
  };
  const handleFileSelect =
    (field, isEdit = false) =>
    (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        const setter = isEdit ? setEditImageFields : setImageFields;
        setter((prev) => ({
          ...prev,
          [field]: { useFile: true, preview: reader.result },
        }));
      };
      reader.readAsDataURL(file);
    };

  const toggleUploadType = (field, isEdit = false) => {
    const setter = isEdit ? setEditImageFields : setImageFields;
    const state = isEdit ? editImageFields : imageFields;

    setter((prev) => ({
      ...prev,
      [field]: { ...prev[field], useFile: !prev[field].useFile },
    }));

    if (!state[field].useFile) {
      const carSetter = isEdit ? setEditCar : setNewCar;
      carSetter((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const renderImageField = (field, isEdit = false) => {
    const state = isEdit ? editImageFields : imageFields;
    const refs = isEdit ? editFileInputRefs : fileInputRefs;
    const carState = isEdit ? editCar : newCar;

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium">
            Image {field.slice(-1)}
          </label>
          <button
            type="button"
            onClick={() => toggleUploadType(field, isEdit)}
            className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded-md"
          >
            {state[field].useFile ? "Use URL" : "Upload File"}
          </button>
        </div>

        {state[field].useFile ? (
          <>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                ref={refs[field]}
                onChange={handleFileSelect(field, isEdit)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white"
              />
              <Upload
                size={16}
                className="absolute right-3 top-3 text-gray-400"
              />
            </div>
            {state[field].preview && (
              <div className="relative w-full h-24 rounded-md overflow-hidden">
                <img
                  src={state[field].preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </>
        ) : (
          <input
            type="text"
            name={field}
            value={carState[field]}
            onChange={isEdit ? handleEditCarChange : handleNewCarChange}
            placeholder={`Image ${field.slice(-1)} URL`}
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        )}
      </div>
    );
  };

  const addCar = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setIsUploading(true);

      const formData = new FormData();
      formData.append("brand", newCar.brand);
      formData.append("model", newCar.model);
      formData.append("year", newCar.year);
      formData.append("color", newCar.color);
      formData.append("seats", newCar.seats);
      formData.append("horsepower", newCar.horsepower);
      formData.append("type", newCar.type);
      formData.append("category", getCategoryIdFromType(newCar.type));

      // Add the new price fields
      formData.append("price_per_day", newCar.price_per_day);
      formData.append("price_per_week", newCar.price_per_week);
      formData.append("price_per_month", newCar.price_per_month);

      const imageFiles = [];
      ["image1", "image2", "image3"].forEach((field) => {
        if (
          imageFields[field].useFile &&
          fileInputRefs[field].current?.files[0]
        ) {
          imageFiles.push(fileInputRefs[field].current.files[0]);
        } else if (newCar[field]) {
          formData.append(`${field}_url`, newCar[field]);
        }
      });

      // Add image files using 'images' field
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      const response = await fetch(`${API_BASE_URL}/api/cars/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(await response.text());

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
        price_per_day: 0,
        price_per_week: 0,
        price_per_month: 0,
      });
      setImageFields({
        image1: { useFile: false, preview: null },
        image2: { useFile: false, preview: null },
        image3: { useFile: false, preview: null },
      });
      fetchCars();
    } catch (err) {
      setError("Failed to add car: " + err.message);
    } finally {
      setLoading(false);
      setIsUploading(false);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (id) => {
    setCarToDelete(id);
    setShowDeleteModal(true);
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setCarToDelete(null);
  };

  // Confirm delete operation
  const confirmDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/cars/${carToDelete}`, {
        method: "DELETE",
      });
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      fetchCars();
      closeDeleteModal();
    } catch (err) {
      setError("Failed to delete car: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Original delete function (for backwards compatibility)
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
      setError("Failed to delete car: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  const startEditing = (car) => {
    setEditingId(car.id);
    setEditCar({
      brand: car.brand,
      model: car.model,
      year: car.year,
      image1: car.image1 || "",
      image2: car.image2 || "",
      image3: car.image3 || "",
      color: car.color || "",
      seats: car.seats || 0,
      horsepower: car.horsepower || 0,
      type: car.type || "Luxury",
      price_per_day: car.price_per_day || 0,
      price_per_week: car.price_per_week || 0,
      price_per_month: car.price_per_month || 0,
    });
    setEditImageFields({
      image1: { useFile: false, preview: car.image1 },
      image2: { useFile: false, preview: car.image2 },
      image3: { useFile: false, preview: car.image3 },
    });
  };

  const saveEdit = async (id) => {
    try {
      setLoading(true);
      setIsUploading(true);

      const formData = new FormData();
      formData.append("brand", editCar.brand);
      formData.append("model", editCar.model);
      formData.append("year", editCar.year);
      formData.append("color", editCar.color);
      formData.append("seats", editCar.seats);
      formData.append("horsepower", editCar.horsepower);
      formData.append("type", editCar.type);
      formData.append("category", getCategoryIdFromType(editCar.type));

      // Add the price fields
      formData.append("price_per_day", editCar.price_per_day);
      formData.append("price_per_week", editCar.price_per_week);
      formData.append("price_per_month", editCar.price_per_month);

      const imageFiles = [];

      // Alltid behåll befintliga bilder om vi inte specifikt laddar upp nya
      formData.append("keepImage1", "true");
      formData.append("keepImage2", "true");
      formData.append("keepImage3", "true");

      ["image1", "image2", "image3"].forEach((field, index) => {
        const fieldNum = index + 1;

        if (
          editImageFields[field].useFile &&
          editFileInputRefs[field].current?.files[0]
        ) {
          // Om vi laddar upp en ny fil, säg till servern att INTE behålla den gamla bilden
          imageFiles.push(editFileInputRefs[field].current.files[0]);
          formData.append(`keepImage${fieldNum}`, "false");
        } else if (editCar[field]) {
          // Om vi använder URL, skicka det explicit
          formData.append(`${field}_url`, editCar[field]);
          formData.append(`imageUrl${fieldNum}`, editCar[field]);
        }
      });

      // Add image files using 'images' field
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });
      const response = await fetch(`${API_BASE_URL}/api/cars/${id}/upload`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) throw new Error(await response.text());

      setEditingId(null);
      fetchCars();
    } catch (err) {
      setError("Failed to update car: " + err.message);
    } finally {
      setLoading(false);
      setIsUploading(false);
    }
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
      price_per_day: 0,
      price_per_week: 0,
      price_per_month: 0,
    });
    setEditImageFields({
      image1: { useFile: false, preview: null },
      image2: { useFile: false, preview: null },
      image3: { useFile: false, preview: null },
    });
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

  const handleLogout = () => {
    sessionStorage.removeItem("isAdminAuthenticated");
    navigate("/");
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
            <LogOut size={18} className="mr-2" /> Logout
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
                  {CAR_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* New pricing section */}
            <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
              <h3 className="text-lg font-medium mb-3">
                Pricing Information (AED)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price Per Day (AED)
                  </label>
                  <input
                    type="number"
                    name="price_per_day"
                    value={newCar.price_per_day}
                    onChange={handleNewCarChange}
                    min="0"
                    step="0.01"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price Per Week (AED)
                  </label>
                  <input
                    type="number"
                    name="price_per_week"
                    value={newCar.price_per_week}
                    onChange={handleNewCarChange}
                    min="0"
                    step="0.01"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price Per Month (AED)
                  </label>
                  <input
                    type="number"
                    name="price_per_month"
                    value={newCar.price_per_month}
                    onChange={handleNewCarChange}
                    min="0"
                    step="0.01"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {renderImageField("image1")}
              {renderImageField("image2")}
              {renderImageField("image3")}
            </div>

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
                  <th className="text-left p-2 md:p-4 w-16 md:w-auto">Price</th>
                  <th className="text-left p-2 md:p-4 w-24 md:w-auto">Type</th>
                  <th className="text-right p-2 md:p-4 w-24 md:w-auto">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {cars.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="text-center p-4">
                      No cars found. Add your first car above.
                    </td>
                  </tr>
                ) : (
                  cars.map((car) => (
                    <tr key={car.id} className="hover:bg-gray-700/50">
                      {editingId === car.id ? (
                        <>
                          <td className="p-2 md:p-4">{car.id}</td>
                          <td colSpan="9" className="p-2 md:p-4">
                            <div className="bg-gray-750 p-4 rounded-lg">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <label className="block text-sm font-medium mb-1">
                                    Brand
                                  </label>
                                  <input
                                    type="text"
                                    name="brand"
                                    value={editCar.brand}
                                    onChange={handleEditCarChange}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1">
                                    Model
                                  </label>
                                  <input
                                    type="text"
                                    name="model"
                                    value={editCar.model}
                                    onChange={handleEditCarChange}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1">
                                    Year
                                  </label>
                                  <input
                                    type="number"
                                    name="year"
                                    value={editCar.year}
                                    onChange={handleEditCarChange}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1">
                                    Color
                                  </label>
                                  <input
                                    type="text"
                                    name="color"
                                    value={editCar.color}
                                    onChange={handleEditCarChange}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1">
                                    Seats
                                  </label>
                                  <input
                                    type="number"
                                    name="seats"
                                    value={editCar.seats}
                                    onChange={handleEditCarChange}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1">
                                    Horsepower
                                  </label>
                                  <input
                                    type="number"
                                    name="horsepower"
                                    value={editCar.horsepower}
                                    onChange={handleEditCarChange}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1">
                                    Type
                                  </label>
                                  <select
                                    name="type"
                                    value={editCar.type}
                                    onChange={handleEditCarChange}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white text-sm"
                                  >
                                    {CAR_TYPES.map((type) => (
                                      <option key={type} value={type}>
                                        {type}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              {/* Edit pricing fields */}
                              <div className="mb-4 bg-gray-800 p-3 rounded-md border border-gray-700">
                                <h4 className="text-sm font-medium mb-2">
                                  Pricing (AED)
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <label className="block text-xs font-medium mb-1">
                                      Price Per Day
                                    </label>
                                    <input
                                      type="number"
                                      name="price_per_day"
                                      value={editCar.price_per_day}
                                      onChange={handleEditCarChange}
                                      min="0"
                                      step="0.01"
                                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium mb-1">
                                      Price Per Week
                                    </label>
                                    <input
                                      type="number"
                                      name="price_per_week"
                                      value={editCar.price_per_week}
                                      onChange={handleEditCarChange}
                                      min="0"
                                      step="0.01"
                                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium mb-1">
                                      Price Per Month
                                    </label>
                                    <input
                                      type="number"
                                      name="price_per_month"
                                      value={editCar.price_per_month}
                                      onChange={handleEditCarChange}
                                      min="0"
                                      step="0.01"
                                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white text-sm"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="mb-4">
                                <h3 className="text-sm font-medium mb-2">
                                  Images
                                </h3>
                                <div className="grid grid-cols-1 gap-4">
                                  {renderImageField("image1", true)}
                                  {renderImageField("image2", true)}
                                  {renderImageField("image3", true)}
                                </div>
                              </div>

                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => saveEdit(car.id)}
                                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center justify-center"
                                >
                                  <Save size={16} className="mr-2" /> Save
                                </button>
                                <button
                                  onClick={cancelEditing}
                                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center justify-center"
                                >
                                  <X size={16} className="mr-2" /> Cancel
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="p-2 md:p-4 text-right">
                            {/* Mobile buttons moved to the form above */}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-2 md:p-4">{car.id}</td>
                          <td className="p-2 md:p-4">{car.brand}</td>
                          <td className="p-2 md:p-4">{car.model}</td>
                          <td className="p-2 md:p-4">{car.year}</td>
                          <td className="p-2 md:p-4">
                            <div className="flex space-x-1 md:space-x-2">
                              {renderCarImage(car.image1)}
                              <div className="hidden md:block">
                                {renderCarImage(car.image2)}
                                {renderCarImage(car.image3)}
                              </div>
                            </div>
                          </td>
                          <td className="p-2 md:p-4">{car.color || "N/A"}</td>
                          <td className="p-2 md:p-4">{car.seats || 0}</td>
                          <td className="p-2 md:p-4">{car.horsepower || 0}</td>
                          <td className="p-2 md:p-4">
                            {car.price_per_day
                              ? `${car.price_per_day} AED`
                              : "N/A"}
                          </td>
                          <td className="p-2 md:p-4">{car.type || "Luxury"}</td>
                          <td className="p-2 md:p-4 text-right">
                            <div className="flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-2">
                              <button
                                onClick={() => startEditing(car)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md flex items-center justify-center"
                              >
                                <Edit size={16} className="mr-1" /> Edit
                              </button>
                              <button
                                onClick={() => openDeleteModal(car.id)}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6 border border-gray-700">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete this car? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDeleteModal}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <Trash size={16} className="mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
