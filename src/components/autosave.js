// TODO: implement with apollo client graph
import { useFormikContext } from "formik";
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const AutoSave = () => {
    const { values } = useFormikContext();
    let { consultId } = useParams();

    useEffect(() => {
        // parse and stringify data to save in localStorage
        const data = JSON.parse(localStorage.getItem('autosave'));
        data[consultId.toString()] = values;
        localStorage.setItem('autosave', JSON.stringify(data));
    }, [values]);

    return null;
};

export default AutoSave;