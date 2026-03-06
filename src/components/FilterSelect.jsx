const FilterSelect = ({ label, value, options, onChange }) => {
  return (
    <label className="block text-sm">
      <span className="mb-2 block font-semibold text-slate-600 dark:text-slate-300">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="input-control py-2"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
};

export default FilterSelect;
