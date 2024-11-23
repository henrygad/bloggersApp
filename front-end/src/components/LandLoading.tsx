
const LandLoading = ({loading}: {loading: boolean}) => {

  return <span className={`block text-center ${!loading ? '' : 'h-6'} cursor-pointer`}>
  {!loading ? null : 'loading...'}
</span>
}

export default LandLoading;
