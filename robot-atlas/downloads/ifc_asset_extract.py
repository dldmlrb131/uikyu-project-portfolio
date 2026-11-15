"""IFC element metadata and placement export, not a navigation/task generator.
Dependency: an explicitly chosen compatible IfcOpenShell release.
Usage: python ifc_asset_extract.py model.ifc assets.json
No geometry, georeference transform, tool target or reachability is inferred.
"""
import json,sys
from pathlib import Path

def extract(path):
    import ifcopenshell
    import ifcopenshell.util.unit
    import ifcopenshell.util.placement
    model=ifcopenshell.open(str(path))
    scale=ifcopenshell.util.unit.calculate_unit_scale(model)
    rows=[]
    for element in model.by_type('IfcElement'):
        placement=getattr(element,'ObjectPlacement',None)
        # Unsupported placement types must be handled explicitly, not guessed.
        supported=placement is not None and placement.is_a('IfcLocalPlacement')
        matrix=ifcopenshell.util.placement.get_local_placement(placement) if supported else None
        rows.append(dict(ifc_guid=element.GlobalId,ifc_class=element.is_a(),name=element.Name,placement_supported=supported,origin_in_ifc_project_m=[float(matrix[i,3])*scale for i in range(3)] if matrix is not None else None,rotation_rows=matrix[:3,:3].tolist() if matrix is not None else None,frame_id='ifc_project_local',observed_in_field=False,task_target_verified=False))
    return dict(schema_version='ifc-asset-example-1',ifc_schema=model.schema,length_unit_to_m=scale,source_file=str(path),note='ObjectPlacement origin is not geometric center, site CRS or a robot target; validate nested placement/unit and separately apply georeferencing/site alignment.',elements=rows)

if __name__=='__main__':
    if len(sys.argv)!=3:raise SystemExit('Usage: python ifc_asset_extract.py model.ifc assets.json')
    Path(sys.argv[2]).write_text(json.dumps(extract(sys.argv[1]),ensure_ascii=False,indent=2),encoding='utf-8')
