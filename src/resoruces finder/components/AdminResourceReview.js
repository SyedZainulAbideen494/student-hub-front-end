import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminResourceReview.css";
import { API_ROUTES } from "../../app_modules/apiRoutes";

const AdminResourceReview = () => {
    const [pendingResources, setPendingResources] = useState([]);

    useEffect(() => {
        fetchPendingResources();
    }, []);

    // Fetch all pending resources
    const fetchPendingResources = async () => {
        try {
            const response = await axios.get(API_ROUTES.pendingResourceReview);
            setPendingResources(response.data);
        } catch (error) {
            console.error("Error fetching pending resources", error);
        }
    };

    // Approve or delete a resource
    const handleAction = async (resourceId, action) => {
        try {
            await axios.post(API_ROUTES.adminResourceReview, { resourceId, action });
            setPendingResources(pendingResources.filter(res => res.id !== resourceId)); // Remove resource from state
        } catch (error) {
            console.error(`Error ${action === "approve" ? "approving" : "deleting"} resource`, error);
        }
    };

    return (
        <div className="admin__container__resource__review">
            <h1 className="admin__title__resource__review">📌 Pending Resource Approvals</h1>

            {pendingResources.length > 0 ? (
                <div className="admin__resource__list__resource__review">
                    {pendingResources.map((resource) => (
                        <div key={resource.id} className="admin__resource__card__resource__review">
                            <h2>{resource.title}</h2>
                            <p>{resource.description}</p>
                            <a href={resource.link} target="_blank" rel="noopener noreferrer">
                                View Resource
                            </a>

                            <div className="admin__buttons__resource__review">
                                <button className="approve__btn__resource__review" onClick={() => handleAction(resource.id, "approve")}>
                                    ✅ Approve
                                </button>
                                <button className="delete__btn__resource__review" onClick={() => handleAction(resource.id, "delete")}>
                                    ❌ Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="admin__no__resources__resource__review">No pending resources.</p>
            )}
        </div>
    );
};

export default AdminResourceReview;
