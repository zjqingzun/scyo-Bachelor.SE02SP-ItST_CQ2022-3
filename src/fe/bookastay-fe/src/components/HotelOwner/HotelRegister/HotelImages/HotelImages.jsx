import React, { useState, useRef, useCallback, useEffect } from "react";
import { CSS } from "@dnd-kit/utilities";

import "./HotelImages.scss";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { DndContext } from "@dnd-kit/core";
import { toast } from "react-toastify";

const SortableImage = ({ image, deleteImage, className }) => {
    const { setNodeRef, attributes, listeners, transition, transform } = useSortable({
        id: image.name,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition || undefined,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`hotel-images__image-wrap ${className}`}
        >
            <span
                className="hotel-images__delete"
                onMouseDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    deleteImage(image.name);
                }}
                onClick={(event) => {
                    event.stopPropagation();
                    deleteImage(image.name);
                }}
            >
                &times;
            </span>
            <img className="hotel-images__image" src={image.url} alt={image.name} />
        </div>
    );
};

const HotelImages = ({
    handleNext = () => {},
    formData = {},
    updateData = () => {},
    handlePrev = () => {},
}) => {
    const [images, setImages] = useState(formData || []);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const [listFiles, setListFiles] = useState([]);

    const selectFiles = () => {
        fileInputRef.current.click();
    };

    const onFileSelect = (event) => {
        const files = event.target.files;

        insertImages(files);
    };

    const deleteImage = (name) => {
        console.log(name);
        setImages((prev) => prev.filter((_, i) => prev[i].name !== name));
    };

    const onDragOver = (event) => {
        event.preventDefault();
        setIsDragging(true);
        event.dataTransfer.dropEffect = "copy";
    };

    const onDragLeave = (event) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const onDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);

        const files = event.dataTransfer.files;

        insertImages(files);
    };

    const insertImages = (files) => {
        if (files && files.length === 0) return;

        let newFiles = [];

        for (let i = 0; i < files.length; i++) {
            if (files[i].type.split("/")[0] !== "image") {
                continue;
            }

            if (!images.some((image) => image.name === files[i].name)) {
                const image = {
                    name: files[i].name,
                    data: files[i],
                    url: URL.createObjectURL(files[i]),
                };

                setImages((prev) => [...prev, image]);

                newFiles.push(files[i]);
            }
        }

        setListFiles((prev) => [...prev, ...newFiles]);

        fileInputRef.current.value = null;
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over) return;

        if (active?.id !== over?.id) {
            const oldIndex = images.findIndex((image) => image.name === active?.id);
            const newIndex = images.findIndex((image) => image.name === over?.id);
            setImages((items) => arrayMove(items, oldIndex, newIndex));
        }
    };

    const checkValidation = () => {
        if (images.length === 0) {
            toast.error("Please upload at least one image", {
                theme: "colored",
            });
            return;
        }

        updateData(listFiles);
        handleNext();
    };

    useEffect(() => {
        updateData(listFiles);

        window.scrollTo(0, document.body.scrollHeight);
    }, [listFiles]);

    useEffect(() => {
        window.scrollTo(0, document.body.scrollHeight);
    }, []);

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="hotel-images">
                <h1>What does your hotel look like?</h1>

                <div className="row">
                    <div className="col-12">
                        <div
                            className="hotel-images__drag-area"
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onDrop={onDrop}
                        >
                            {isDragging ? (
                                <span className="hotel-images__select">Drop images here</span>
                            ) : (
                                <>
                                    <span>Drag & Drop image here or</span>
                                    <span
                                        className="hotel-images__select"
                                        role="button"
                                        onClick={selectFiles}
                                    >
                                        Browse
                                    </span>
                                </>
                            )}
                            <input
                                type="file"
                                name="file"
                                className="file"
                                multiple
                                ref={fileInputRef}
                                onChange={onFileSelect}
                            />
                        </div>
                    </div>

                    <div className="col-12">
                        {images.length > 0 && (
                            <SortableContext items={images.map((image) => image.name)}>
                                <div className="hotel-images__container mt-0">
                                    {images.length > 0 &&
                                        images.map((image, index) => (
                                            <SortableImage
                                                key={`image-${image.name}-${index}`}
                                                image={image}
                                                name={image.name}
                                                className={index === 0 ? "MainImage" : ""}
                                                deleteImage={deleteImage}
                                            />
                                        ))}
                                </div>
                            </SortableContext>
                        )}
                    </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-3">
                    <button
                        className="btn btn-secondary btn-lg fs-3 px-4"
                        style={{
                            background: "transparent",
                            border: "1px solid #227B94",
                            color: "#227B94",
                        }}
                        onClick={() => handlePrev()}
                    >
                        Back
                    </button>
                    <button
                        type="button"
                        className="btn btn-success btn-lg fs-3 px-4"
                        style={{ background: "#227B94" }}
                        onClick={() => checkValidation()}
                    >
                        Next
                    </button>
                </div>
            </div>
        </DndContext>
    );
};

export default HotelImages;
