import { Input } from 'antd';

const TextInput = ({
    label,
    placeholder = 'Please select',
    allowClear = true,
    icon,
    name,
    value,
    onChange,
    disabled = false
}) => {
    return (
        <div className="w-full mb-4">
            <label >{icon}</label>
            <label className="block font-medium text-gray-700 mb-1">{label}</label>
            <Input disabled={disabled} size='large' name={name} value={value} onChange={onChange} allowClear={allowClear} placeholder={placeholder} />
        </div>
    );
};

export default TextInput;
