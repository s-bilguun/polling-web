import Image from 'next/image';

function Profile({ width, height }) {
  return (
    <div>
      <Image
        src="/pages/images/02.jpg"
        alt="Profile Picture"
        className='profile-image'
        width={width}
        height={height}
      />
    </div>
  );
}

export default Profile;