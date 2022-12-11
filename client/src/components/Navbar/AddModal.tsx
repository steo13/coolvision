import { Box, Button, Modal, TextField } from "@mui/material";
import { useState } from "react";
import { addProject } from "../../API";
import { Project } from "../List/ProjectList.types";

interface Props {
    showModal: boolean,
    handleClose: () => void
}

function AddModal({showModal, handleClose}: Props) {
    const [project, setProject] = useState<Project>()
    
    const handleSubmit = () => {
        addProject(project!);
        handleClose();
        window.location.reload()
    }

    return (
        <Modal open={showModal} aria-labelledby="modal-modal-title" onClose={handleClose} aria-describedby="modal-modal-description">
            <Box className='AddModal-box'>
                <div className="container mt-2">
                    <div className="row justify-content-md-center">
                        <div className="col-md-auto">
                            <TextField 
                                value={project?.name} 
                                variant="standard" 
                                label="Insert a name" 
                                onChange={e => setProject({ id: project?.id, jira: project?.jira, name: e.target.value } as Project)}
                            />
                        </div>
                    </div>
                    <div className="row justify-content-md-center">
                        <div className="col-md-auto">
                            <TextField 
                                value={project?.jira}
                                variant="standard" 
                                label="Insert a Jira code"
                                onChange={e => setProject({ id: project?.id, name: project?.name, jira: e.target.value } as Project)}
                            />
                        </div>
                    </div>
                    <div className="row justify-content-md-center">
                        <div className="mt-2 col-md-auto">
                            <Button variant="contained" disabled={project?.jira && project?.name ? false : true} onClick={() => handleSubmit()}>
                                Add
                            </Button>
                        </div>
                    </div>
                </div>
            </Box>
        </Modal>
    )
}

export default AddModal;