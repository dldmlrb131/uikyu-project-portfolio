"""Small offline conversion example; NOT a complete navigation mapper.
XYZ obstacle samples and optional observed-free XY samples must already be in
one metric frame. Missing points remain unknown. Does not infer traversability.
Uses Python stdlib only. Produces PGM + Nav2-style YAML + provenance JSON.
"""
import argparse,csv,json,math
from pathlib import Path

def read_points(path,axes):
    with open(path,newline='',encoding='utf-8-sig') as f:
        rows=list(csv.DictReader(f))
    points=[]
    for i,row in enumerate(rows,2):
        try:vals=tuple(float(row[a]) for a in axes)
        except (ValueError,KeyError) as e:raise ValueError(f'{path}:{i}: required {axes}') from e
        if not all(math.isfinite(v) for v in vals):raise ValueError(f'{path}:{i}: nonfinite coordinate')
        points.append(vals)
    return points

def build(points,free,resolution,zmin,zmax,bounds,max_cells=4_000_000):
    if not math.isfinite(resolution) or resolution<=0:raise ValueError('resolution must be finite and >0')
    if not all(math.isfinite(v) for v in [zmin,zmax,*bounds]) or zmax<zmin:raise ValueError('invalid height/bounds')
    xmin,ymin,xmax,ymax=bounds
    if xmax<=xmin or ymax<=ymin:raise ValueError('bounds need xmax>xmin,ymax>ymin')
    w=math.ceil((xmax-xmin)/resolution);h=math.ceil((ymax-ymin)/resolution)
    if w*h>max_cells:raise ValueError('map exceeds cell budget')
    grid=bytearray([205])*(w*h)
    def index(x,y):
        if not(xmin<=x<xmax and ymin<=y<ymax):return None
        ix=math.floor((x-xmin)/resolution);iy=math.floor((y-ymin)/resolution)
        return (h-1-iy)*w+ix
    for x,y in free:
        k=index(x,y)
        if k is not None:grid[k]=254
    for x,y,z in points:
        if zmin<=z<=zmax:
            k=index(x,y)
            if k is not None:grid[k]=0
    return w,h,grid

def main():
    a=argparse.ArgumentParser(description=__doc__)
    a.add_argument('xyz_csv');a.add_argument('--observed-free',help='optional XY CSV; externally verified visible free samples')
    a.add_argument('--resolution',type=float,default=.1);a.add_argument('--z-min',type=float,required=True);a.add_argument('--z-max',type=float,required=True)
    a.add_argument('--bounds',type=float,nargs=4,required=True,metavar=('XMIN','YMIN','XMAX','YMAX'))
    a.add_argument('--frame',required=True);a.add_argument('--map-version',required=True);a.add_argument('--output',default='map')
    v=a.parse_args()
    if not v.frame.strip() or not v.map_version.strip():a.error('frame/map-version must be nonempty')
    points=read_points(v.xyz_csv,('x','y','z'));free=read_points(v.observed_free,('x','y')) if v.observed_free else []
    w,h,grid=build(points,free,v.resolution,v.z_min,v.z_max,v.bounds)
    out=Path(v.output)
    if not out.name or any(c in out.name for c in ['\n','\r']):a.error('invalid output filename')
    out.parent.mkdir(parents=True,exist_ok=True)
    pgm=out.with_suffix('.pgm');yml=out.with_suffix('.yaml');meta=out.with_suffix('.json')
    pgm.write_bytes(f'P5\n{w} {h}\n255\n'.encode('ascii')+grid)
    yml.write_text(f'image: {json.dumps(pgm.name)}\nmode: trinary\nresolution: {v.resolution}\norigin: [{v.bounds[0]}, {v.bounds[1]}, 0.0]\nnegate: 0\noccupied_thresh: 0.65\nfree_thresh: 0.196\n',encoding='utf-8')
    meta.write_text(json.dumps(dict(frame_id=v.frame,map_version=v.map_version,input=v.xyz_csv,observed_free=v.observed_free,bounds=v.bounds,z_band=[v.z_min,v.z_max],resolution=v.resolution,cells=dict(width=w,height=h),consumer_setup='Configure map_server frame_id to match this frame_id, provide validated TF and independent navigation checks.',status='engineering example; field validation required',missing='no raycasting, inflation, terrain, sensor uncertainty, dynamic update, localization or safety certification'),indent=2),encoding='utf-8')
    print(f'Wrote {pgm}, {yml}, {meta}; unknown cells are preserved.')

if __name__=='__main__':main()
