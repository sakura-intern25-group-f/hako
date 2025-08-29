import { Octokit } from "@octokit/rest";
import { crypto_box_seal } from "libsodium-wrappers";

const decodeBase64 = (base64: string) => {
  return new Uint8Array(Buffer.from(base64, "base64"));
};
const encodeBase64 = (bin: Uint8Array) => {
  return Buffer.from(bin).toString("base64");
};

export const createSecret = async (
  octkit: Octokit,
  owner: string,
  repo: string,
  secret_name: string,
  secret: string,
) => {
  const key_resp = await octkit.rest.actions.getRepoPublicKey({ owner, repo });
  const key_id = key_resp.data.key_id;
  const pub_key = key_resp.data.key;
  const encrypted_value = crypto_box_seal(secret, decodeBase64(pub_key));
  await octkit.rest.actions.createOrUpdateRepoSecret({
    owner,
    repo,
    secret_name,
    key_id,
    encrypted_value: encodeBase64(encrypted_value),
  });
};
