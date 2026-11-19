export interface GalleryVideo {
  id: string;
  title: string;
  description: string;
  format: string;
  thumbnail: string;
  url: string;
}

/**
 * Thumbnails are Cloudinary-generated poster frames: the `so_0` transformation
 * grabs the first frame of each video as a JPG, so every card matches its clip
 * without depending on a local image asset.
 */
export const VIDEO_GALLERY: GalleryVideo[] = [
  {
    id: 'gate-fabrication',
    title: 'Gate Fabrication Process',
    description: 'Watch our team craft a modern sliding gate from raw steel to finished product.',
    format: 'MP4 Video',
    thumbnail:
      'https://res.cloudinary.com/dmvmc4f1/video/upload/so_0/v1785415402/82ce7f9f-f961-4f34-bf03-e15c9d3582ff_vewduv.jpg',
    url: 'https://res.cloudinary.com/dmvmc4f1/video/upload/f_mp4/v1785415402/82ce7f9f-f961-4f34-bf03-e15c9d3582ff_vewduv.mov',
  },
  {
    id: 'staircase-installation',
    title: 'Staircase Installation',
    description: 'See the precision engineering behind our custom spiral staircase installation.',
    format: 'MP4 Video',
    thumbnail:
      'https://res.cloudinary.com/dmvmc4f1/video/upload/so_0/v1785415404/5e398746-23e5-4f0c-bbcd-d386e3ea6569_l6qtkv.jpg',
    url: 'https://res.cloudinary.com/dmvmc4f1/video/upload/f_mp4/v1785415404/5e398746-23e5-4f0c-bbcd-d386e3ea6569_l6qtkv.mov',
  },
  {
    id: 'workshop-tour',
    title: 'Workshop Tour',
    description: 'A guided tour of our state-of-the-art metal fabrication workshop in Tantra Hill.',
    format: 'MP4 Video',
    thumbnail:
      'https://res.cloudinary.com/dmvmc4f1/video/upload/so_0/v1785415421/ced4f97d-ff4c-4da2-916b-04502787101b_eivz0g.jpg',
    url: 'https://res.cloudinary.com/dmvmc4f1/video/upload/v1785415421/ced4f97d-ff4c-4da2-916b-04502787101b_eivz0g.mp4',
  },
  {
    id: 'security-door-showcase',
    title: 'Security Door Showcase',
    description: 'Featuring our premium security door collection with modern design elements.',
    format: 'MP4 Video',
    thumbnail:
      'https://res.cloudinary.com/dmvmc4f1/video/upload/so_0/v1785415425/6e8ccc0c-4d4a-4c02-bbb1-53f28e28d357_jrtd27.jpg',
    url: 'https://res.cloudinary.com/dmvmc4f1/video/upload/v1785415425/6e8ccc0c-4d4a-4c02-bbb1-53f28e28d357_jrtd27.mp4',
  },
  {
    id: 'industrial-roofing',
    title: 'Industrial Roofing Project',
    description: 'Time-lapse of a large-scale industrial roofing structure installation.',
    format: 'MP4 Video',
    thumbnail:
      'https://res.cloudinary.com/dmvmc4f1/video/upload/so_0/v1785415423/1465e137-087c-4007-8325-6e076f83a942_k8lkpd.jpg',
    url: 'https://res.cloudinary.com/dmvmc4f1/video/upload/v1785415423/1465e137-087c-4007-8325-6e076f83a942_k8lkpd.mp4',
  },
  {
    id: 'client-testimonial',
    title: 'Client Testimonial Video',
    description: 'Hear from our satisfied clients about their experience with METAL BRIDGES.',
    format: 'MP4 Video',
    thumbnail:
      'https://res.cloudinary.com/dmvmc4f1/video/upload/so_0/v1785415417/fb10164d-ab2a-49e2-9f9a-02b84ef9668e_sightj.jpg',
    url: 'https://res.cloudinary.com/dmvmc4f1/video/upload/v1785415417/fb10164d-ab2a-49e2-9f9a-02b84ef9668e_sightj.mp4',
  },
];
