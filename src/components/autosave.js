// TODO: implement this with apollo client graph
import { useFormikContext } from "formik";
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const AutoSave = () => {
    const { values } = useFormikContext();
    let { consultId } = useParams();

    // run this always the form values change
    useEffect(() => {
        // parse and stringify data to save in localStorage
        const data = JSON.parse(localStorage.getItem('autosave'));
        // TODO: fix this.
        // to lose reference, needed temporarily by the nulling below
        data[consultId.toString()] = JSON.parse(JSON.stringify(values));;
        // TODO: fix this. temporarily nullling this to facilitate the
        // loading to resume the answer
        data[consultId.toString()].illName = null;
        data[consultId.toString()].subillName = null;
        localStorage.setItem('autosave', JSON.stringify(data));
    }, [values]);

    return null;
};

export default AutoSave;